import { ContractStatus } from './contract.status';
import { WorkSchedule } from './workSchedule.model';

export interface Contract {
  id?: number;
  contract_code?: string;
  contract_name?: string;
  contract_type?: string;
  employee_code?: string;
  status?: ContractStatus;
  start_date?: Date | string;
  end_date?: Date | string;
  basic_salary?: number;
  job_position?: string;
  shift?: string;
  work_schedule_id?: number;
  type_of_work?: string;
  pay_frequency?: string;
  note?: string;
  work_schedule?: WorkSchedule;
}
