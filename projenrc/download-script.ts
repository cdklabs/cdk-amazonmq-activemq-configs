import { TaskOptions, TaskStep } from 'projen';

// url: https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/amazon-mq-broker-configuration-parameters.html
// xsdUrlPrefix: https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/samples/
export class DownloadScript implements TaskOptions, TaskStep {
    public get exec(): string {
        return `curl -s ${this.url} | grep -Ewo 'amazon-mq-active-mq-\\d+\\.\\d+\\.\\d+\\.xsd\\.zip' | awk '{ print \"${this.xsdUrlPrefix}\" $0 \" \" $0 }' | xargs -L1 bash -c 'curl $0 --output $1 && unzip -o $1 && rm $1'`.trimEnd();
    }

    public constructor(private readonly url: string, private readonly xsdUrlPrefix: string) { }

    public toJSON() {
        return {
            exec: this.exec,
        };
    }
}