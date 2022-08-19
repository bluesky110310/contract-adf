import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ContractNewDialogComponent } from 'app/contract-new-dialog/contract-new-dialog.component';
import { MinimalNode, Pagination, QueryBody, ResultNode, ResultSetPaging } from '@alfresco/js-api';
import { DataRowEvent, DataTableComponent, PaginationModel, SearchService } from '@alfresco/adf-core';

@Component({
  selector: 'app-contract-home',
  templateUrl: './contract-home.component.html',
  styleUrls: ['./contract-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContractHomeComponent implements OnInit {
  approvals = []

  recents = [
    { name: 'CA Road Company Contract' },
    { name: 'XYZ LLC Enhancement Contract' },
    { name: 'Kleen Construction Upgrade' }
  ]

  pagination: Pagination = {
    maxItems: 5,
    skipCount: 0
  }

  sizes: Array<number> = [5, 10]

  isLoadingApproval: boolean = false
  isLoading: boolean = false

  defaultQueryBody: QueryBody = {
    query: {
      query: "PATH:\"app:company_home/cm:Contracts/*\""
    },
    paging: this.pagination,
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

  ngOnInit(): void {
    this.isLoadingApproval = true

    let queryBody: QueryBody = { ...this.defaultQueryBody, paging: { maxItems: 3 } }

    this.searchService.searchByQueryBody(queryBody).subscribe((rec: ResultSetPaging) => {
      let entries = rec.list.entries

      for (let i = 0; i < entries.length; i++) {
        const entry: ResultNode = entries[i].entry
        this.approvals.push({
          id: entry.id,
          name: entry.name,
        })
      }
    }, (error: any) => { console.log(error) }, () => {
      this.isLoadingApproval = false
    })
  }

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

    let queryBody: QueryBody = { ...this.defaultQueryBody, paging: { ...this.pagination } }

    this.searchService.searchByQueryBody(queryBody).subscribe((rec: ResultSetPaging) => {
      this.pagination = rec.list.pagination

      let entries = rec.list.entries

      for (let i = 0; i < entries.length; i++) {
        const entry: ResultNode = entries[i].entry
        this.rows.push({
          id: entry.id,
          name: entry.name,
          status: 'in approval',
          created_by: entry.createdByUser.displayName,
          last_mod_by: entry.modifiedByUser.displayName,
          last_mod_on: entry.modifiedAt
        })
      }
    }, (error: any) => { console.log(error) }, () => {
      this.isLoading = false

      this.defaultQueryBody.paging = this.pagination
    })
  }

  onShowDetail(event: DataRowEvent) {
    const { id } = event.value.obj

    this.router.navigate(['contract', id, 'detail'])
    
    // this.router.navigate(['/contract', id, 'detail']);
  }

  onChangePagination(event: PaginationModel) {
    this.pagination = {
      maxItems: event.maxItems,
      skipCount: event.skipCount
    }

    this.onSearch()
  }
}
