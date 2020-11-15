import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class PhotoService {

    constructor(private http: HttpClient) {}

    upload(vehicleId, photo) {

        var formData = new FormData();
        formData.append('file', photo);
        return this.http.post(`/api/vehicles/${vehicleId}/photos`, formData, {
            reportProgress: true,
            observe: 'events'
        });
    }

    getPhotos(vehicleId) {
        return this.http.get(`/api/vehicles/${vehicleId}/photos`);
    }
}