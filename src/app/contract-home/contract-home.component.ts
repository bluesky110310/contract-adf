import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ContractNewDialogComponent } from 'app/contract-new-dialog/contract-new-dialog.component';
import { MinimalNode, NodeEntry, NodePaging, QueryBody, ResultNode, ResultSetPaging } from '@alfresco/js-api';
import { NodesApiService, SearchService } from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';

@Component({
  selector: 'app-contract-home',
  templateUrl: './contract-home.component.html',
  styleUrls: ['./contract-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContractHomeComponent implements OnInit {
  @ViewChild('documentList')
  documentList: DocumentListComponent

  contractFolderId: string

  approvals = []

  recents = [
    { name: 'CA Road Company Contract' },
    { name: 'XYZ LLC Enhancement Contract' },
    { name: 'Kleen Construction Upgrade' }
  ]

  isLoadingApproval: boolean = true

  constructor(private nodeApiService: NodesApiService, private searchService: SearchService, public router: Router, public dialog: MatDialog) {
    this.nodeApiService.getNode(`-root-`, {
      relativePath: '/Contracts'
    }).subscribe((row: MinimalNode) => {
      this.contractFolderId = row.id

      this.onLoadApprovals()
    })
  }

  ngOnInit(): void { }

  onLoadApprovals() {
    this.isLoadingApproval = true
    this.approvals = []

    this.nodeApiService.getNodeChildren(this.contractFolderId, {
      maxItems: 3,
      orderBy: ['createdAt DESC']
    }).subscribe((row: NodePaging) => {
      let entries = row.list.entries

      for (let i = 0; i < entries.length; i++) {
        const entry: ResultNode = entries[i].entry
        this.approvals.push({
          id: entry.id,
          name: entry.name,
        })
      }
    }, (error: any) => {
      console.log(error)
      this.isLoadingApproval = false
    }, () => {
      this.isLoadingApproval = false
    })
  }

  onNewContract() {
    this.dialog.open(ContractNewDialogComponent, {
      width: '600px',
      disableClose: true
    }).afterClosed().subscribe(() => {
      this.onLoadApprovals()
      this.documentList.reload()
    })
  }

  onShowDetail(event) {
    this.router.navigate(['contract', event.value.entry.id, 'detail'])
  }
}
