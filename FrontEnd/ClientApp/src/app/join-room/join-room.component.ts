import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../Services/chat.service';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css']
})
export class JoinRoomComponent {

  private route = inject(Router);
  private service = inject(ChatService);

JoinRoom = new FormGroup({
  user:new FormControl("",[Validators.required]),
  room:new FormControl("",[Validators.required])
})  

getControl(Data:any):AbstractControl|null{
  return this.JoinRoom.get(Data);
}

joinRoomSubmit()
{
 if(this.JoinRoom.valid){

  
  
  const user = this.JoinRoom.value.user;
  const room = this.JoinRoom.value.room;

  user && sessionStorage.setItem('user',user);
  room && sessionStorage.setItem('room',room);

  user && room &&  this.service.joinRoom(user,room).then(()=>{
    this.route.navigate(['chat']);
  }).catch((errror)=>{
    console.log(errror);
  }) 
 
 }
}
}
