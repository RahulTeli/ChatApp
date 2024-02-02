import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { ChatService } from '../Services/chat.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  public service = inject(ChatService);
  private route = inject(Router);
  private toast = inject(NgToastService);

  messages :any[] = [];
  inputMessage :string="";
  loggedInUserName=sessionStorage.getItem('user');
  roomName = sessionStorage.getItem('room');
  @ViewChild('scrollMe') private scrollContainer! :ElementRef;   // using ViewChild() we can directly get html elements 

  ngOnInit(){
    this.service.message$.subscribe((response)=>{
      if(response)
      {
        this.messages = response;
      }
    })
  }

  ngAfterViewChecked()
  {
    this.scrollContainer.nativeElement.scrollTop=this.scrollContainer.nativeElement.scrollHeight   // it will automatically scrolled  according to height of div
  }  

  sendMessage()
  {
    if(this.inputMessage!="")
    {
      this.service.sendMessage(this.inputMessage).then((response)=>{
        this.inputMessage = "";
    }).catch((error)=>{
      console.log(error)
    })
    }
    
  }

  leaveChat()
  {
    this.service.leaveChat().then((response)=>{
       this.route.navigate(['/welcome']);
      setTimeout(()=>{
        location.reload() /////////////////////////////////// the most IMP  method to reload page 
      },0)

   
    }).catch((error)=>{
      console.log(error);
    })
  }

  showInfo() {
    this.loggedInUserName && this.toast.info({detail:"INFO",summary:this.loggedInUserName + ' left the Group',duration:8000,sticky:true, position: 'topRight'});
  }

}
