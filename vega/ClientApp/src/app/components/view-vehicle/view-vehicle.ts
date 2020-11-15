
import { VehicleService } from './../../services/vehicle.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoService } from 'src/app/services/photo.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  templateUrl: 'view-vehicle.html',
  styleUrls: ['./view-vehicle.css']
})
export class ViewVehicleComponent implements OnInit {
  @ViewChild('fileInput', {static : false}) fileInput: ElementRef;
  vehicle: any;
  vehicleId: number; 
  photos;
  percentDone;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private vehicleService: VehicleService,
    private photoService: PhotoService) { 

    route.params.subscribe(p => {
      this.vehicleId = +p['id'];
      if (isNaN(this.vehicleId) || this.vehicleId <= 0) {
        router.navigate(['/vehicles']);
        return; 
      }
    });
  }

  ngOnInit() { 
    this.photoService.getPhotos(this.vehicleId)
      .subscribe(photos => this.photos = photos);

    this.vehicleService.getVehicle(this.vehicleId)
      .subscribe(
        v => this.vehicle = v,
        err => {
          if (err.status == 404) {
            this.router.navigate(['/vehicles']);
            return; 
          }
        });
  }

  delete() {
    if (confirm("Are you sure?")) {
      console.log(this.vehicle.id)
      this.vehicleService.delete(this.vehicle.id)
        .subscribe(x => {
          this.router.navigate(['/vehicles']);
        });
    }
  }

  uploadPhoto() {
    var nativeElement: HTMLInputElement = this.fileInput.nativeElement;
    var file = nativeElement.files[0]
    nativeElement.value = '';
    
    this.photoService.upload(this.vehicleId, file)
      .subscribe(photo => {
        if(photo.type === HttpEventType.UploadProgress)
        {
          this.percentDone = Math.round(100 * photo.loaded / photo.total);
          console.log(this.percentDone);
        }
        if(this.percentDone === 100){
          this.photos.push(photo);
        }
    },
    null,
    () => { this.percentDone = null});
  }
}