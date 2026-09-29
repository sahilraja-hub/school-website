export interface StoredAdmissionDocument {
  id: string;
  applicationId?: string;
  applicationNumber?: string;
  documentType: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  fileData?: string; // base64 or storage reference
  uploadedAt: string;
  isPrivate: boolean;
  uploadedBy?: string;
}

class AdmissionDocumentRepository {
  private documents: Map<string, StoredAdmissionDocument> = new Map();

  constructor() {
    this.seedDefaultDocs();
  }

  private seedDefaultDocs() {
    this.documents.set('doc-demo-01', {
      id: 'doc-demo-01',
      applicationId: 'adm-001',
      applicationNumber: 'ADM-2026-1042',
      documentType: 'BIRTH_CERTIFICATE',
      fileName: 'birth-certificate-alexander.pdf',
      fileType: 'application/pdf',
      fileSizeBytes: 245000,
      fileData: 'JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKEJpcnRoIENlcnRpZmljYXRlKQo...',
      uploadedAt: new Date().toISOString(),
      isPrivate: true,
      uploadedBy: 'Robert Hayes',
    });
  }

  public save(doc: StoredAdmissionDocument): StoredAdmissionDocument {
    this.documents.set(doc.id, doc);
    return doc;
  }

  public findById(id: string): StoredAdmissionDocument | null {
    return this.documents.get(id) || null;
  }

  public findByApplicationNumber(appNum: string): StoredAdmissionDocument[] {
    return Array.from(this.documents.values()).filter(
      (d) => d.applicationNumber === appNum
    );
  }

  public delete(id: string): boolean {
    return this.documents.delete(id);
  }
}

export const admissionDocumentRepository = new AdmissionDocumentRepository();
