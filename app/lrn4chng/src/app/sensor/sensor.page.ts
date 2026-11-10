import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Subscription
} from 'rxjs';

import {
  BleService,
  SensorData
} from '../core/sensors';


@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.page.html',
  styleUrls: ['./sensor.page.scss'],
  standalone: false
})
export class SensorPage
  implements OnInit, OnDestroy {


  sensorData: SensorData | null = null;

  connected = false;

  private subscription?: Subscription;


  constructor(
    private bleService: BleService
  ) {}


  async ngOnInit() {

    await this.bleService.initialize();


    this.subscription =
      this.bleService.sensorData$
        .subscribe(data => {

          this.sensorData = data;

          this.connected =
            data !== null;

        });
  }


  async connect() {

    try {

      await this.bleService.connect();

      this.connected = true;

    } catch (error) {

      console.error(
        'BLE connection failed:',
        error
      );

      this.connected = false;
    }
  }


  async disconnect() {

    await this.bleService.disconnect();

    this.connected = false;

    this.sensorData = null;
  }


  ngOnDestroy() {

    this.subscription?.unsubscribe();
  }
}