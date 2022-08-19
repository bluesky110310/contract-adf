import { DocumentListComponent } from '@alfresco/adf-content-services';
import { NodesApiService, NotificationService } from '@alfresco/adf-core';
import { MinimalNode } from '@alfresco/js-api';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PreviewService } from 'app/services/preview.service';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.scss']
})
export class ContractDetailComponent implements OnInit {
  @ViewChild('documentList')
  documentList: DocumentListComponent;
  
  contractId: string
  contract: MinimalNode

  isLoading: boolean = true

  constructor(private notificationService: NotificationService, private nodeApiService: NodesApiService, private preview: PreviewService, public activatedRouter: ActivatedRoute, public router: Router) {
    this.contractId = this.activatedRouter.snapshot.paramMap.get('contractId')
    this.nodeApiService.getNode(this.contractId).subscribe((row: MinimalNode) => {
      this.contract = row
      this.isLoading = false
    })
  }

  ngOnInit(): void {
  }

  uploadSuccess() {
    this.notificationService.openSnackMessage('File uploaded');
    this.documentList.reload();
  }

  showPreview(event) {
    const entry = event.value.entry;
    if (entry && entry.isFile) {
      this.preview.showResource(entry.id);
    }
  }

  onBack() {
    this.router.navigateByUrl('/contract/home')
  }
}
