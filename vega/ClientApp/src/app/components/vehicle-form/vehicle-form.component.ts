import { Component, OnInit } from '@angular/core';
import { VehicleService } from 'src/app/services/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, observable } from 'rxjs';
import { forkJoin} from 'rxjs';
import { SaveVehicle, Vehicle } from 'src/app/models/vehicle';


@Component({
  selector: 'vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  makes;
  features;
  models: any[];
  vehicle: SaveVehicle = {
    id: 0,
    makeId: 0,
    modelId: 0,
    isRegistered: false,
    features: [],
    contact: {
      name: '',
      email: '',
      phone: ''
    }
  };
 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService) {
      route.params.subscribe(p => {
        this.vehicle.id = +p['id'] || 0;
      });
     }

  ngOnInit() {
    var sources : any[] = [
      this.vehicleService.getMakes(),
      this.vehicleService.getFeatures()
    ];

    if (this.vehicle.id)
      sources.push(this.vehicleService.getVehicle(this.vehicle.id));

      var values$ = forkJoin(sources).subscribe( data => {
          this.makes = data[0];
          this.features = data[1];

          if(this.vehicle.id){
            this.setVehicle(<Vehicle>data[2]);
            this.populateModels();
          }
        },err => {
            if (err.status == 404)
              this.router.navigate(['/home']);
        });
  }

  private setVehicle(v: Vehicle) {
    var f: any[] = [];

    this.vehicle.id = v.id;
    this.vehicle.makeId = v.make.id;
    this.vehicle.modelId = v.model.id;
    this.vehicle.isRegistered = v.isRegistered;
    this.vehicle.contact = v.contact;
    for(var i of v.features){
        f.push(i.id);
    };
    this.vehicle.features = f;      
  }

  onMakeChange(){
    this.populateModels();
    delete this.vehicle.modelId;
  }

  private populateModels() {
    var selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);
    this.models = selectedMake ? selectedMake.models : [];
  }

  onFeatureToggle(featureId, $event){
    if ($event.target.checked)
      this.vehicle.features.push(featureId);

    else {
      var index = this.vehicle.features.indexOf(featureId);
      this.vehicle.features.splice(index, 1);
    }
  }

  submit(){
    if (this.vehicle.id) {
      this.vehicleService.update(this.vehicle)
        .subscribe(x => {
          console.log(x);
        });
    }
    else{
      this.vehicleService.create(this.vehicle)
        .subscribe(x => console.log(x));
    } 
    this.router.navigate(['/vehicles/', this.vehicle.id])
  }

  delete(){
    if(confirm("Are you sure?")){
      this.vehicleService.delete(this.vehicle.id)
        .subscribe(x => {
          this.router.navigate(['/vehicles/']);
        });
    }
  }
}
