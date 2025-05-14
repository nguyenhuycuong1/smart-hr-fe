import { Injectable } from '@angular/core';
import { BaseService } from '../../services/app-service/base.service';
import { Observable } from 'rxjs';
import { ApiResponse, PageFilterRequest } from '../../shared/models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ManageAttendanceService extends BaseService {}
