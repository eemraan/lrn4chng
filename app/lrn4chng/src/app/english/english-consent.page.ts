import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-english-consent',
  templateUrl: './english-consent.page.html',
  styleUrls: ['./english-consent.page.scss'],
  standalone: false
})
export class EnglishConsentPage implements OnInit {
  uid: string = '';

  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.uid = params['uid'] ?? '';
    });
  }
}
