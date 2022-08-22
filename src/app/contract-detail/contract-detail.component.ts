import { DocumentListComponent } from '@alfresco/adf-content-services';
import { CommentContentService, CommentModel, NodesApiService, NotificationService } from '@alfresco/adf-core';
import { MinimalNode, NodeEntry } from '@alfresco/js-api';
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
  documentList: DocumentListComponent
  
  isLoading: boolean = true
  contractId: string
  contract: MinimalNode

  selectedNodeIds: NodeEntry[] = []

  isLoadingComments: boolean = false
  comments: CommentModel[] = []

  constructor(private notificationService: NotificationService, private nodeApiService: NodesApiService, private commentService: CommentContentService, private preview: PreviewService, public activatedRouter: ActivatedRoute, public router: Router) {
    this.contractId = this.activatedRouter.snapshot.paramMap.get('contractId')
    this.nodeApiService.getNode(this.contractId).subscribe((row: MinimalNode) => {
      this.contract = row
      this.isLoading = false
    })
  }

  ngOnInit(): void {
  }

  onBack() {
    this.router.navigateByUrl('/contract/home')
  }

  uploadSuccess() {
    this.notificationService.openSnackMessage('File uploaded');
    this.documentList.reload();
  }

  onDelete() {
    const msg = this.selectedNodeIds.length > 1 ? "Do you really delete the files?" : "Do you really delete the file?"
    if( confirm(msg) ) {
      this.selectedNodeIds.forEach((node: NodeEntry) => {
        this.nodeApiService.deleteNode(node.entry.id)
      })

      this.documentList.reload()
    }
  }

  onNodeSelected(event: NodeEntry[]) {
    this.selectedNodeIds = event

    const selectedNode = event[event.length - 1]
    if (selectedNode) {
      this.isLoadingComments = true
      this.commentService.getNodeComments(selectedNode.entry.id).subscribe((comments: CommentModel[]) => {
        this.comments = comments
        this.isLoadingComments = false
      })
    }
  }

  onPreview(event) {
    const entry = event.value.entry;
    console.log(entry)
    if (entry && entry.isFile) {
      this.preview.showResource(entry.id);
    }
  }
}
