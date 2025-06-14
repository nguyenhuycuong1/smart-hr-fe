export interface MailSender {
  id?: number;
  mail_account_id?: number;
  mail_template_id?: number;
  to?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  content?: string;
}
