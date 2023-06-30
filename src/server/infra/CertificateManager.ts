import pem, {CertificateCreationResult} from 'pem';
import {SecureContext, createSecureContext, SecureContextOptions} from 'tls';
import fs from 'fs';
import * as Buffer from 'buffer';
import path from 'path';

type CreateCsrResponse = {
    csr: any;
    clientKey: any;
}

const CERT_ROOT = './certs/sites/';
const CA_CERT_ROOT = './certs/CA/';
const CA_CERT_NAME = 'myCA';
const CA_CERT_DEFAULT = 'default';

export class CertificateManager {
    public static get defaultCert(): Buffer {
        return fs.readFileSync( `${CA_CERT_ROOT}${CA_CERT_DEFAULT}.pem`);
    }

    public static get defaultKey(): Buffer {
        return fs.readFileSync(`${CA_CERT_ROOT}${CA_CERT_DEFAULT}.key`);
    }

    private static get caCert(): Buffer {
        return fs.readFileSync(`${CA_CERT_ROOT}${CA_CERT_NAME}.pem`);
    }

    private static get caKey(): Buffer {
        return fs.readFileSync(`${CA_CERT_ROOT}${CA_CERT_NAME}.key`);
    }

    public static async getCertificate(domain: string): Promise<SecureContext> {
        let context = await CertificateManager.getLocalCertificate(domain);
        if (!context) {
            const csr = await CertificateManager.createCsr(domain);
            const cert = await CertificateManager.createCertificate(csr);
            CertificateManager.saveAsFile(`${domain}.pem`, cert.certificate);
            CertificateManager.saveAsFile(`${domain}.key`, csr.clientKey);
            context = {
                cert: cert.certificate,
                key: cert.clientKey,
                ca: CertificateManager.caCert
            };
        }
        return createSecureContext(context);
    }

    public static clearCache() {
        const files = fs.readdirSync(CERT_ROOT);
        for (const file of files) {
            fs.unlinkSync(path.join(CERT_ROOT, file))
        }
    }

    private static async createCsr(domain: string) {
        return new Promise<CreateCsrResponse>((resolve, reject) => {
            pem.createCSR({
                country: 'IL',
                locality: 'Jerusalem',
                organization: 'Gigya Dev',
                organizationUnit: 'Dev',
                commonName: 'test_cert_1',
                altNames: [domain]
            }, (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            })
        });
    }

    private static getLocalCertificate(domain: string): SecureContextOptions {
        if (fs.existsSync(`${CERT_ROOT}${domain}.pem`)) {
            return {
                cert: fs.readFileSync(`${CERT_ROOT}${domain}.pem`),
                key: fs.readFileSync(`${CERT_ROOT}${domain}.key`),
                ca: CertificateManager.caCert
            };
        }
        return null;
    }

    private static async createCertificate(csr: CreateCsrResponse) {
        return new Promise<CertificateCreationResult>((resolve, reject) => {
            pem.createCertificate({
                csr: csr.csr,
                serviceCertificate: CertificateManager.caCert.toString(),
                serviceKey: CertificateManager.caKey.toString(),
                days: 825,
                clientKeyPassword: 'gigya'
            }, (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            })
        });
    }
    private static saveAsFile(fileName: string, content: string) {
        fs.writeFile(`${CERT_ROOT}${fileName}`, content, (err) => {
            if (err) {
                throw new Error('Unable to save local file')
            }
        });
    }
}