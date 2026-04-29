'use client';

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';

type CoverLetterData = {
  fullName: string;
  email: string;
  phone: string;
  recipient: string;
  subject: string;
  body: string;
};

const pdfStyles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 48,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#111827',
  },
  header: {
    marginBottom: 18,
  },
  name: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    fontSize: 10,
    color: '#374151',
  },
  section: {
    marginTop: 14,
  },
  label: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 4,
  },
  text: {
    fontSize: 11,
    lineHeight: 1.45,
  },
  paragraph: {
    marginBottom: 10,
  },
});

function CoverLetterPdf({ data }: { data: CoverLetterData }) {
  const today = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const paragraphs = data.body
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.name}>{data.fullName || 'Your Name'}</Text>
          <View style={pdfStyles.metaRow}>
            <Text>{data.email || 'email@example.com'}</Text>
            <Text>{data.phone || '+1 (555) 000-0000'}</Text>
          </View>
        </View>

        <View>
          <Text style={pdfStyles.text}>{today}</Text>
        </View>

        {!!data.recipient && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.label}>Recipient</Text>
            <Text style={pdfStyles.text}>{data.recipient}</Text>
          </View>
        )}

        {!!data.subject && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.label}>Subject</Text>
            <Text style={pdfStyles.text}>{data.subject}</Text>
          </View>
        )}

        <View style={pdfStyles.section}>
          {paragraphs.length > 0 ? (
            paragraphs.map((p, idx) => (
              <Text key={idx} style={[pdfStyles.text, pdfStyles.paragraph]}>
                {p}
              </Text>
            ))
          ) : (
            <Text style={pdfStyles.text}>
              Write your cover letter in the form and download it as a PDF.
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
}

const defaultBody = `Dear Hiring Manager,

I am writing to express my interest in the role. I bring strong experience building reliable web applications and enjoy working closely with product and design to ship high-quality user experiences.

In my recent projects, I have focused on clean architecture, performance, and maintainability. I am comfortable owning features end-to-end, from initial requirements to production monitoring and iteration.

Thank you for your time and consideration.

Sincerely,
`;

function sanitizeFileBase(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function Home() {
  const [data, setData] = React.useState<CoverLetterData>({
    fullName: '',
    email: '',
    phone: '',
    recipient: '',
    subject: '',
    body: defaultBody,
  });
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const fileNameBase = sanitizeFileBase(data.fullName || 'cover-letter');
  const fileName = `${fileNameBase || 'cover-letter'}.pdf`;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 880,
          background: '#0f172a',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: 12,
          padding: 20,
        }}
      >
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 380px' }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
              Cover Letter PDF Generator
            </h1>
            <p style={{ marginTop: 8, marginBottom: 0, color: '#cbd5e1' }}>
              Fill in the fields, then download a PDF.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isClient ? (
              <PDFDownloadLink
                document={<CoverLetterPdf data={data} />}
                fileName={fileName}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  padding: '0 14px',
                  borderRadius: 10,
                  background: '#3b82f6',
                  color: '#0b1220',
                  textDecoration: 'none',
                  fontWeight: 700,
                }}
              >
                {({ loading }) =>
                  loading ? 'Generating PDF…' : `Download PDF (${fileName})`
                }
              </PDFDownloadLink>
            ) : (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  padding: '0 14px',
                  borderRadius: 10,
                  background: 'rgba(59, 130, 246, 0.4)',
                  color: '#0b1220',
                  fontWeight: 700,
                  userSelect: 'none',
                }}
              >
                Download PDF
              </span>
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            display: 'grid',
            gap: 12,
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          <Field
            label="Full name"
            value={data.fullName}
            onChange={(v) => setData((p) => ({ ...p, fullName: v }))}
            placeholder="Jane Doe"
          />
          <Field
            label="Email"
            value={data.email}
            onChange={(v) => setData((p) => ({ ...p, email: v }))}
            placeholder="jane@example.com"
          />
          <Field
            label="Phone"
            value={data.phone}
            onChange={(v) => setData((p) => ({ ...p, phone: v }))}
            placeholder="+1 (555) 000-0000"
          />
          <Field
            label="Recipient"
            value={data.recipient}
            onChange={(v) => setData((p) => ({ ...p, recipient: v }))}
            placeholder="Company / Hiring Manager"
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <Field
            label="Subject"
            value={data.subject}
            onChange={(v) => setData((p) => ({ ...p, subject: v }))}
            placeholder="Application for Software Engineer"
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700 }}>
            Cover letter
          </label>
          <textarea
            value={data.body}
            onChange={(e) =>
              setData((p) => ({
                ...p,
                body: e.target.value,
              }))
            }
            rows={16}
            style={{
              marginTop: 8,
              width: '100%',
              resize: 'vertical',
              borderRadius: 10,
              border: '1px solid rgba(148, 163, 184, 0.25)',
              background: '#0b1220',
              color: '#e5e7eb',
              padding: 12,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas',
              fontSize: 13,
              lineHeight: 1.4,
            }}
            placeholder="Write your cover letter here..."
          />
          <div style={{ marginTop: 6, fontSize: 12, color: '#94a3b8' }}>
            Use blank lines to separate paragraphs.
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 700 }}>
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          marginTop: 8,
          width: '100%',
          height: 40,
          borderRadius: 10,
          border: '1px solid rgba(148, 163, 184, 0.25)',
          background: '#0b1220',
          color: '#e5e7eb',
          padding: '0 12px',
          fontSize: 13,
        }}
      />
    </div>
  );
}
