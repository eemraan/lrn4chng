import { Injectable } from '@angular/core';

import {
  BleClient,
  BleDevice,
} from '@capacitor-community/bluetooth-le';

import { BehaviorSubject } from 'rxjs';

export interface SensorData {
  temperature: number;
  humidity: number;
  light: number;
  co2: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class BleService {

  // =========================================================
  // ESP32 BLE UUIDs
  // =========================================================

  readonly SERVICE_UUID =
    '4fafc201-1fb5-459e-8fcc-c5c9c331914b';

  readonly DATA_UUID =
    'beb5483e-36e1-4688-b7f5-ea07361b26a8';


  // =========================================================
  // BLE device
  // =========================================================

  private device: BleDevice | null = null;


  // =========================================================
  // Sensor data
  // =========================================================

  private sensorDataSubject =
    new BehaviorSubject<SensorData | null>(null);

  sensorData$ =
    this.sensorDataSubject.asObservable();


  // =========================================================
  // Prevent multiple notifications
  // =========================================================

  private readingReceived = false;


  // =========================================================
  // Initialize Bluetooth
  // =========================================================

  async initialize(): Promise<void> {

    await BleClient.initialize();

    console.log('BLE initialized');
  }


  // =========================================================
  // Scan and connect to ESP32
  // =========================================================

  async connect(): Promise<void> {

    console.log('Scanning for ESP32...');

    // Reset one-shot flag
    this.readingReceived = false;


    // ---------------------------------------------------------
    // Find ESP32
    // ---------------------------------------------------------

    const device =
      await BleClient.requestDevice({
        services: [this.SERVICE_UUID]
      });

    this.device = device;

    console.log(
      'Device found:',
      device.name
    );


    // ---------------------------------------------------------
    // Connect
    // ---------------------------------------------------------

    await BleClient.connect(
      device.deviceId,
      (deviceId) => {

        console.log(
          'Disconnected:',
          deviceId
        );

        if (
          this.device &&
          this.device.deviceId === deviceId
        ) {
          this.device = null;
        }
      }
    );

    console.log('Connected to ESP32');


    // ---------------------------------------------------------
    // Start notifications
    // ---------------------------------------------------------

    await this.startNotifications();
  }


  // =========================================================
  // Receive ONE sensor reading
  // =========================================================

  private async startNotifications(): Promise<void> {

    if (!this.device) {
      throw new Error(
        'No BLE device connected'
      );
    }

    const deviceId =
      this.device.deviceId;


    await BleClient.startNotifications(

      deviceId,

      this.SERVICE_UUID,

      this.DATA_UUID,

      async (value) => {

        // -----------------------------------------------------
        // Ignore anything after the first reading
        // -----------------------------------------------------

        if (this.readingReceived) {
          return;
        }


        const payload =
          this.dataViewToString(value);

        console.log(
          'BLE data:',
          payload
        );


        // -----------------------------------------------------
        // Parse JSON
        // -----------------------------------------------------

        let data: SensorData;

        try {

          data =
            JSON.parse(payload) as SensorData;

        } catch (error) {

          console.error(
            'Invalid sensor JSON:',
            payload
          );

          return;
        }


        // -----------------------------------------------------
        // Mark reading as received
        // -----------------------------------------------------

        this.readingReceived = true;


        // -----------------------------------------------------
        // Send data to Angular
        // -----------------------------------------------------

        this.sensorDataSubject.next(data);

        console.log(
          'Sensor reading received.'
        );


        // -----------------------------------------------------
        // Stop notifications
        // -----------------------------------------------------

        try {

          await BleClient.stopNotifications(
            deviceId,
            this.SERVICE_UUID,
            this.DATA_UUID
          );

          console.log(
            'Notifications stopped.'
          );

        } catch (error) {

          console.warn(
            'Could not stop notifications:',
            error
          );
        }


        // -----------------------------------------------------
        // Disconnect immediately
        // -----------------------------------------------------

        try {

          await BleClient.disconnect(
            deviceId
          );

          console.log(
            'Disconnected after one reading.'
          );

        } catch (error) {

          console.warn(
            'Could not disconnect:',
            error
          );
        }


        // -----------------------------------------------------
        // Clear device reference
        // -----------------------------------------------------

        this.device = null;
      }
    );
  }


  // =========================================================
  // Convert BLE DataView → string
  // =========================================================

  private dataViewToString(
    value: DataView
  ): string {

    const bytes =
      new Uint8Array(
        value.buffer,
        value.byteOffset,
        value.byteLength
      );

    return new TextDecoder().decode(bytes);
  }


  // =========================================================
  // Manual disconnect
  // =========================================================

  async disconnect(): Promise<void> {

    if (!this.device) {
      return;
    }

    const deviceId =
      this.device.deviceId;


    // ---------------------------------------------------------
    // Stop notifications
    // ---------------------------------------------------------

    try {

      await BleClient.stopNotifications(
        deviceId,
        this.SERVICE_UUID,
        this.DATA_UUID
      );

    } catch (error) {

      console.warn(
        'Could not stop notifications:',
        error
      );
    }


    // ---------------------------------------------------------
    // Disconnect
    // ---------------------------------------------------------

    try {

      await BleClient.disconnect(
        deviceId
      );

    } catch (error) {

      console.warn(
        'Could not disconnect:',
        error
      );
    }


    this.device = null;

    this.readingReceived = false;

    console.log(
      'Disconnected'
    );
  }


  // =========================================================
  // Connection status
  // =========================================================

  isConnected(): boolean {

    return this.device !== null;
  }
}