import {Injectable} from '../DI';
import fs from 'fs';
import readline from 'readline';

const win = process.platform === 'win32';
const DEFAULT_HOSTS = win ? 'C:/Windows/System32/drivers/etc/hosts' : '/etc/hosts';

const SECTION = '# DEV SITE SECTION --- $1 ---';

class HostFileEntry {
    constructor(
        private ip: string,
        private host: string,
        private comment?: string) {
    }

    public get line(): string {
        return `${this.ip} ${this.host}${this.comment ? ` #${this.comment}` : ''}\r\n`;
    }
}

@Injectable()
export class HostsFile {
    private hostsFileContent: string;
    private currentSection: string;
    private readonly sections: Map<string, HostFileEntry[]>;

    constructor() {
        this.sections = new Map<string, HostFileEntry[]>();
        this.init();
    }

    public async init() {
        this.hostsFileContent = '';
        const sectionRegex = /^# DEV SITE SECTION --- (.+) ---$/
        const entryRegex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s+(.+?)\s*(?:#\s*(.+))?$/;
        const fileStream = fs.createReadStream(DEFAULT_HOSTS);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let inSection = false;
        for await(const line of rl) {
            const lineData = sectionRegex.exec(line)
            if (lineData && !inSection) {
                inSection = true;
                this.startSection(lineData[1]);
                continue;
            }
            else if (lineData && inSection) {
                inSection = false;
                this.endSection();
                continue;
            }

            if (inSection) {
                const splitLine = entryRegex.exec(line);
                this.sections.get(this.currentSection).push(new HostFileEntry(
                    splitLine[1],
                    splitLine[2],
                    splitLine[3] ?? null));
            } else {
                this.hostsFileContent += `${line}\r\n`;
            }
        }
    }

    public startSection(name: string): HostsFile {
        if (!this.sections.has(name)) {
            this.sections.set(name, []);
        }
        this.currentSection = name;
        return this;
    }

    public endSection(): HostsFile  {
        this.currentSection = null;
        return this;
    }

    public clearSection(): HostsFile {
        this.sections.set(this.currentSection, []);
        return this;
    }

    public addItem(target: string, host: string, comment?: string): HostsFile {
        this.sections.get(this.currentSection).push(new HostFileEntry(target, host, comment));
        return this;
    }

    public flush() {
        let fileContent = this.hostsFileContent;

        for (const [section, entries] of this.sections.entries()) {
            if (entries.length === 0) continue;
            fileContent += SECTION.replace('$1', section) + '\r\n';
            for (const entry of entries) {
                fileContent += entry.line;
            }
            fileContent += SECTION.replace('$1', section) + '\r\n';
        }
        fs.writeFileSync(DEFAULT_HOSTS, fileContent);
    }
}