import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-french-consent',
  templateUrl: './french-consent.page.html',
  styleUrls: ['./french-consent.page.scss'],
  standalone: false
})
export class FrenchConsentPage implements OnInit {
  uid: string = '';

  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.uid = params['uid'] ?? '';
    });
  }
}
