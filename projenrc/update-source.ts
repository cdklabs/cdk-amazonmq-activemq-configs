import { Component, Task, github, javascript } from 'projen';
import { DownloadScript } from './download-script';

const UPDATE_JOB_ID = 'update_source';

interface DataSource {
    url: string;
    xsdUrlPrefix: string;
}

export interface SourceUpdateOptions {
    readonly name: string;
    readonly source: DataSource;
    readonly schedule?: string;
    readonly cwd?: string;
}

export class SourceUpdate extends Component {
    public readonly task: Task;
    public readonly workflow: github.TaskWorkflow;

    public constructor(project: javascript.NodeProject, options: SourceUpdateOptions) {
        if (!project.github) {
            throw new Error('Can only add SourceUpdate to a root project');
        }

        super(project);

        if (options.name === 'all') {
            throw new Error('Source name "all" is reserved');
        }

        const taskName = `update-sources:${options.name}`;
        const workflowName = `update-sources-${options.name}`;


        this.task = project.addTask(taskName, {
            steps: [new DownloadScript(options.source.url, options.source.xsdUrlPrefix,)],
            cwd: options.cwd
        });

        this.updateAllTask.spawn(this.task);

        this.workflow = new github.TaskWorkflow(project.github, {
            jobId: UPDATE_JOB_ID,
            name: workflowName,
            permissions: {
                contents: github.workflows.JobPermission.READ,
                idToken: github.workflows.JobPermission.NONE,
                pullRequests: github.workflows.JobPermission.WRITE,
            },
            task: this.task,
            preBuildSteps: [
                ...project.renderWorkflowSetup(),
            ],
            postBuildSteps: [
                ...github.WorkflowActions.createPullRequest({
                    pullRequestTitle: `feat(sources): update ${options.name}`,

                    pullRequestDescription: [
                        '> ⚠️ This Pull Request updates daily and will overwrite **all** manual changes pushed to the branch',
                        '',
                        `Updates the ${options.name} source from upstream`,
                    ].join('\n'),
                    workflowName,
                    credentials: project.github.projenCredentials,
                    labels: ['auto-approve'],
                    baseBranch: 'main',
                    branchName: `update-source/${options.name}`,
                }),
                {
                    if: '${{ steps.create-pr.outputs.pull-request-number }}',
                    env: {
                        GH_TOKEN: '${{ github.token }}',
                    },
                    name: 'add-instructions',
                    run:
                        `echo -e "${[
                            '**To work on this Pull Request, please create a new branch and PR. This prevents your work from being deleted by the automation.**',
                            '',
                            'Run the following commands inside the repo:',
                            '\\`\\`\\`console',
                            'gh co ${{ steps.create-pr.outputs.pull-request-number }}',
                            'git switch -c fix-pr-${{ steps.create-pr.outputs.pull-request-number }} && git push -u origin HEAD',
                            'gh pr create -t \\"fix: PR #${{ steps.create-pr.outputs.pull-request-number }}\\" --body \\"Fixes ${{ steps.create-pr.outputs.pull-request-url }}\\"',
                            '\\`\\`\\`',
                        ].join('\\n')}"` + '| gh pr comment ${{ steps.create-pr.outputs.pull-request-number }} -F-',
                },
            ],
        });

        this.workflow.on({
            workflowDispatch: {},
            schedule: [{ cron: options.schedule ?? '11 3 * * 1-5' }],
        });
    }

    private get updateAllTask(): Task {
        const name = 'update-sources:all';
        return this.project.tasks.tryFind(name) ?? this.project.addTask(name);
    }
}  