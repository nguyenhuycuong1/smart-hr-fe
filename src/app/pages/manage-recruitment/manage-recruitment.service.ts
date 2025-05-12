import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ApiResponse,
  InterviewSchedule,
  JobPost,
  PageFilterRequest,
  PageResponse,
  RecruitmentRequest,
  RecruitmentRequestRecord,
  RecruitmentRequestStatus,
} from '../../shared/models';
import { Observable } from 'rxjs';
import { Candidate, CandidateStatus } from '../../shared/models/candidate.model';

@Injectable({
  providedIn: 'root',
})
export class ManageRecruitmentService {
  private readonly API_URL: string = environment.api_endpoint;
  constructor(private httpClient: HttpClient) {}

  /* Recruitment Request Service */

  searchRecruitmentRequest(
    request: PageFilterRequest<RecruitmentRequest>,
  ): Observable<PageResponse<RecruitmentRequestRecord[]>> {
    return this.httpClient.post<PageResponse<RecruitmentRequestRecord[]>>(
      `${this.API_URL}/api/recruitment-requests/search`,
      request,
    );
  }

  createRecruitmentRequest(
    request: RecruitmentRequest,
  ): Observable<ApiResponse<RecruitmentRequest>> {
    return this.httpClient.post<ApiResponse<RecruitmentRequest>>(
      `${this.API_URL}/api/recruitment-requests/create`,
      request,
    );
  }

  updateRecruitmentRequest(
    request: RecruitmentRequest,
  ): Observable<ApiResponse<RecruitmentRequest>> {
    return this.httpClient.put<ApiResponse<RecruitmentRequest>>(
      `${this.API_URL}/api/recruitment-requests/update`,
      request,
    );
  }

  deleteRecruitmentRequest(id?: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/api/recruitment-requests/delete/${id}`);
  }

  updateStatusRecruitmentRequest(
    list: RecruitmentRequest[],
    status: RecruitmentRequestStatus,
    username_created: string,
  ): Observable<ApiResponse<any>> {
    return this.httpClient.put<ApiResponse<any>>(
      `${this.API_URL}/api/recruitment-requests/update-status/${username_created}/${status}`,
      list,
    );
  }

  /* Job Post Service */

  searchJobPost(request: PageFilterRequest<any>): Observable<PageResponse<any>> {
    return this.httpClient.post<PageResponse<any>>(`${this.API_URL}/api/job-posts/search`, request);
  }

  createJobPost(request: any): Observable<ApiResponse<any>> {
    return this.httpClient.post<ApiResponse<any>>(`${this.API_URL}/api/job-posts/create`, request);
  }

  getJobPostByResquestCode(request_code: string): Observable<ApiResponse<any>> {
    return this.httpClient.get<ApiResponse<any>>(
      `${this.API_URL}/api/job-posts/get-by-request-code/${request_code}`,
    );
  }

  getJobPostByJobPostCode(job_post_code: string): Observable<ApiResponse<any>> {
    return this.httpClient.get<ApiResponse<any>>(
      `${this.API_URL}/api/job-posts/get-by-job-post-code/${job_post_code}`,
    );
  }

  updateJobPost(request: JobPost): Observable<ApiResponse<JobPost>> {
    return this.httpClient.put<ApiResponse<JobPost>>(
      `${this.API_URL}/api/job-posts/update`,
      request,
    );
  }

  deleteJobPost(id: number): Observable<ApiResponse<any>> {
    return this.httpClient.delete<ApiResponse<any>>(`${this.API_URL}/api/job-posts/${id}`);
  }

  /* Pipeline Stage Service */

  searchPipelineStage(request: PageFilterRequest<any>): Observable<ApiResponse<any>> {
    return this.httpClient.post<ApiResponse<any>>(
      `${this.API_URL}/api/pipeline-stages/search`,
      request,
    );
  }

  createPipelineStage(request: any): Observable<ApiResponse<any>> {
    return this.httpClient.post<ApiResponse<any>>(
      `${this.API_URL}/api/pipeline-stages/create`,
      request,
    );
  }

  deletePipelineStage(id: number): Observable<ApiResponse<any>> {
    return this.httpClient.delete<ApiResponse<any>>(
      `${this.API_URL}/api/pipeline-stages/delete/${id}`,
    );
  }

  updateStageOrder(request: any): Observable<ApiResponse<any>> {
    return this.httpClient.patch<ApiResponse<any>>(
      `${this.API_URL}/api/pipeline-stages/update-stage-order`,
      request,
    );
  }

  updateStageName(request: any): Observable<ApiResponse<any>> {
    return this.httpClient.patch<ApiResponse<any>>(
      `${this.API_URL}/api/pipeline-stages/update-stage-name`,
      request,
    );
  }

  /* Candidate Service */

  searchCandidate(request: PageFilterRequest<Candidate>): Observable<PageResponse<Candidate[]>> {
    return this.httpClient.post<PageResponse<Candidate[]>>(
      `${this.API_URL}/api/candidates/search`,
      request,
    );
  }

  createCandidate(request: Candidate): Observable<ApiResponse<Candidate>> {
    return this.httpClient.post<ApiResponse<Candidate>>(
      `${this.API_URL}/api/candidates/create`,
      request,
    );
  }

  updateCandidate(request: Candidate): Observable<ApiResponse<Candidate>> {
    return this.httpClient.put<ApiResponse<Candidate>>(
      `${this.API_URL}/api/candidates/update`,
      request,
    );
  }
  deleteCandidate(id: number): Observable<ApiResponse<any>> {
    return this.httpClient.delete<ApiResponse<any>>(`${this.API_URL}/api/candidates/delete/${id}`);
  }

  getCandidateByCandidateCode(candidate_code: string): Observable<ApiResponse<any>> {
    return this.httpClient.get<ApiResponse<any>>(
      `${this.API_URL}/api/candidates/${candidate_code}`,
    );
  }

  /* Candidate Stages Service */

  searchCandidateStages(request: PageFilterRequest<any>): Observable<PageResponse<any>> {
    return this.httpClient.post<PageResponse<any>>(
      `${this.API_URL}/api/candidate-stages/search`,
      request,
    );
  }

  createCandidateStages(request: any): Observable<ApiResponse<any>> {
    return this.httpClient.post<ApiResponse<any>>(
      `${this.API_URL}/api/candidate-stages/create`,
      request,
    );
  }

  updateCandidateStages(request: any): Observable<ApiResponse<any>> {
    return this.httpClient.put<ApiResponse<any>>(
      `${this.API_URL}/api/candidate-stages/update`,
      request,
    );
  }

  deleteCandidateStages(id: number): Observable<ApiResponse<any>> {
    return this.httpClient.delete<ApiResponse<any>>(
      `${this.API_URL}/api/candidate-stages/delete/${id}`,
    );
  }

  deleteAndUpdateCandidateStage(id: number, status: CandidateStatus): Observable<ApiResponse<any>> {
    return this.httpClient.delete<ApiResponse<any>>(
      `${this.API_URL}/api/candidate-stages/delete-and-update/${id}/${status}`,
    );
  }

  // Interview Session

  createInterviewSession(request: InterviewSchedule): Observable<ApiResponse<any>> {
    return this.httpClient.post<ApiResponse<any>>(
      `${this.API_URL}/api/interview-sessions/create`,
      request,
    );
  }

  getAllInterviewSession(): Observable<ApiResponse<any>> {
    return this.httpClient.get<ApiResponse<any>>(`${this.API_URL}/api/interview-sessions`);
  }

  getInterviewSessionByWeek(currentWeek: Date, weekOffset: number): Observable<ApiResponse<any[]>> {
    const params: HttpParams = new HttpParams()
      .set('timestamp', currentWeek.getTime())
      .set('weekOffset', weekOffset);
    return this.httpClient.get<ApiResponse<any[]>>(
      `${this.API_URL}/api/interview-sessions/by-week`,
      {
        params,
      },
    );
  }

  updateInterviewSession(request: InterviewSchedule): Observable<ApiResponse<any>> {
    return this.httpClient.put<ApiResponse<any>>(
      `${this.API_URL}/api/interview-sessions/update`,
      request,
    );
  }

  deleteInterviewSession(id: number): Observable<ApiResponse<any>> {
    return this.httpClient.delete<ApiResponse<any>>(
      `${this.API_URL}/api/interview-sessions/delete/${id}`,
    );
  }
}
