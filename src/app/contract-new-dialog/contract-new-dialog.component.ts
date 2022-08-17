import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService, NodesApiService, FormModel, FormService, FormOutcomeEvent, FormFieldModel, NotificationService } from '@alfresco/adf-core';
import { MinimalNode, NodeEntry } from '@alfresco/js-api';
import { ContractForm } from './contract-form';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-contract-new-dialog',
  templateUrl: './contract-new-dialog.component.html',
  styleUrls: ['./contract-new-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContractNewDialogComponent implements OnInit {
  contractFrom: FormModel
  isDisableSave: boolean = false
  isHiddenUpload: boolean = true

  contractNodeId: string
  contractNode: MinimalNode = null

  constructor(private authService: AuthenticationService,
    private nodeApiService: NodesApiService,
    private notificationService: NotificationService,
    private formService: FormService,
    public dialogRef: MatDialogRef<ContractNewDialogComponent>) {
  }

  ngOnInit(): void {
    let formDefinitionJSON: any = ContractForm.getDefinition()
    this.contractFrom = this.formService.parseForm(formDefinitionJSON)
  }

  onContractSaved(event: FormOutcomeEvent) {
    let outcome = event.outcome

    if (outcome) {
      let form = outcome.form
      if (form) {
        if (form.isValid) {
          const { title, description } = form.values
          this.nodeApiService.createNodeMetadata("cm:folder", "cm", {title: title, description: description}, "/Contracts", title).subscribe((entry: NodeEntry) => {
            this.contractNodeId = entry.entry.id
            this.contractNode = entry.entry
            this.isHiddenUpload = false
            this.isDisableSave = true
            this.contractFrom.getFormFields().forEach((item: FormFieldModel) => {
              item.readOnly = true
              item.updateForm()
            })
          }, (error: any) => { console.log(error) }, () => {
            this.notificationService.showInfo("New contract folder was successfully created.\r\nPlease upload the attachments.", "Notice!")
          })
        }

        event.preventDefault()
      }
    }
  }
}
