export interface MailTemplate {
  id?: number;
  mail_template_name?: string;
  subject_template?: string;
  content_template?: string;
  sending_object?: string;
  description?: string;
}
