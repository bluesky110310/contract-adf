import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ContractNewDialogComponent } from 'app/contract-new-dialog/contract-new-dialog.component';
import { MinimalNode, QueryBody, ResultNode, ResultSetPaging } from '@alfresco/js-api';
import { SearchService } from '@alfresco/adf-core';

@Component({
  selector: 'app-contract-home',
  templateUrl: './contract-home.component.html',
  styleUrls: ['./contract-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContractHomeComponent implements OnInit {
  approvals = [
    { name: 'New York Road Company Contract' },
    { name: 'ABC LLC Enhancement Contract' },
    { name: 'Smith Construction Upgrade' }
  ]

  recents = [
    { name: 'CA Road Company Contract' },
    { name: 'XYZ LLC Enhancement Contract' },
    { name: 'Kleen Construction Upgrade' }
  ]

  isLoading: boolean = false

  defaultQueryBody: QueryBody = {
    query: {
      query: "PATH:\"app:company_home/cm:Contracts/*\""
    },
    paging: {
      maxItems: 10,
      skipCount: 0
    },
    filterQueries: [
      { query: "TYPE:'cm:folder'" }
    ],
    sort: [{
      type: "FIELD",
      field: "created",
      ascending: false
    }]
  }

  schema: Array<any> = [{
    type: 'text',
    key: 'name',
    title: 'Name',
    cssClass: 'adf-ellipsis-cell adf-expand-cell-3',
    sortable: true
  }, {
    type: 'text',
    key: 'status',
    title: 'Status',
    sortable: true
  }, {
    type: 'text',
    key: 'created_by',
    title: 'Created By',
    sortable: true
  }, {
    type: 'text',
    key: 'last_mod_by',
    title: 'Last Mod By',
    sortable: true
  }, {
    type: 'date',
    key: 'last_mod_on',
    title: 'Last Mod On',
    sortable: true,
    cssClass: 'adf-ellipsis-cell adf-expand-cell-2',
  }]

  rows: Array<any> = []

  constructor(private searchService: SearchService, public router: Router, public dialog: MatDialog) {
    this.onSearch()
  }

  ngOnInit(): void { }

  onNewContract(): void {
    this.dialog.open(ContractNewDialogComponent, {
      width: '600px',
      disableClose: true
    }).afterClosed().subscribe((entry: MinimalNode) => {
      if (entry) this.onSearch()
    })
  }

  onSearch(): void {
    this.rows.splice(0, this.rows.length)

    this.isLoading = true

    this.searchService.searchByQueryBody(this.defaultQueryBody).subscribe((rec: ResultSetPaging) => {
      let entries = rec.list.entries

      for (let i = 0; i < entries.length; i++) {
        const entry: ResultNode = entries[i].entry
        this.rows.push({
          name: entry.name,
          status: 'in approval',
          created_by: entry.createdByUser.displayName,
          last_mod_by: entry.modifiedByUser.displayName,
          last_mod_on: entry.modifiedAt
        })
      }
    }, (error: any) => { console.log(error) }, () => {
      this.isLoading = false
    })
  }
}
