import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SaveVehicle } from '../models/vehicle';


@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient) { }

  getMakes() {
    return this.http.get('/api/makes');
  }
  
  getFeatures(){
    return this.http.get('/api/features');
  }

  create(vehicle) {
    return this.http.post('/api/vehicles', vehicle);
  }

  getVehicle(id){
    return this.http.get('/api/vehicles/' + id);
  }

  update(vehicle: SaveVehicle) {
    return this.http.put('/api/vehicles/' + vehicle.id, vehicle);
  }

  delete(id) {
    return this.http.delete('/api/vehicles/' + id);
  }

  getVehicles(filter){
    return this.http.get('/api/vehicles' + '?' + this.toQUeryString(filter));
  }

  toQUeryString(obj){
    var parts = [];
    for (var property in obj) {
      var value = obj[property];
      if(value != null && value != undefined)
        parts.push(encodeURIComponent(property) + '=' + encodeURIComponent(value));
    }

    return parts.join('&');
  }
}
