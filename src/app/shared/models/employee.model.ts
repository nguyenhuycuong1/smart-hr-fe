export interface Employee {
  id?: number;
  employee_code?: string;
  first_name?: string;
  last_name?: string;
  dob?: string;
  hire_date?: string;
  resign_date?: string;
  gender?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  current_address?: string;
  employee_type?: string;
  department_code?: string;
  team_code?: string;
  job_code?: string;
  tax_number?: string;
  health_insurance_code?: string;
  social_insurance_code?: string;
  identification_number?: string;
  marital_status?: string;
  note?: string;
}

export interface EmployeeRecord extends Employee {
  department: any;
  contractActive: any;
  team: any;
  jobPosition: any;
}

export interface EmployeeProfile {
  employee: Employee;
  contracts: any;
  bank_info: any;
  department?: any;
  team?: any;
  job_position?: any;
}
