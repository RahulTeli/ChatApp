import { Inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { NgToastService } from 'ng-angular-popup';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  

  public message$  = new BehaviorSubject<any>([]);
  public ConnectedUsers$ = new BehaviorSubject<string[]>([]);   /// BehaviourSubject is used to transfer data to unconnected component
  public messages :any[] = [];
  public users:string[] = [];

  constructor(private toast : NgToastService) { 
    this.start();
    this.connection.on("ReceiveMessage",(user:string,message:string,messageTime:string)=>{

      this.messages = [...this.messages,{user,message,messageTime}];

      this.message$.next(this.messages);

      if(message.includes("has Left the Group") || message.includes("has Joined the Group"))
      {
        this.showSuccessTopLeft(message);
      }

      

    });

    this.connection.on("ConnectedUser",(users:any)=>{
    this.ConnectedUsers$.next(users);
    
    })

  }

  public connection:signalR.HubConnection = new signalR.HubConnectionBuilder().withUrl("http://localhost:5000/chat")
  .configureLogging(signalR.LogLevel.Information).build();

  //start connection
  public async start()
  {
    try{
      await this.connection.start();
      console.warn("Connection Established");
      
    }
    catch(error){
      console.log(error);
      
    }
  }

  //join room
  public async joinRoom(user:string,room:string)
  {
    return this.connection.invoke("JoinRoom",{user,room});  // calling JoinRoom method of backend by providing values as argument
  }
 

  // send message
  public async sendMessage(message:string)
  {
    return this.connection.invoke("SendMessage",message);
  }


  //leave chat
  public async leaveChat()
  {
    return this.connection.stop();
  }


  showSuccessTopLeft(user:string) {
    this.toast.success({detail:"SUCCESS",summary:user,duration:6000, position:"topRight"});
  }





}
