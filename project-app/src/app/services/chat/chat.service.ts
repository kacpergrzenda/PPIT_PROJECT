import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import firestore from 'firebase/app';
import firebase from 'firebase/app';


import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private afs: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) { }

  /* Retrieves the chat document as an Observable. */
  get() {
    return this.afs
      .collection<any>('chats')
      .doc('feed')
      .snapshotChanges()
      .pipe(
        map(doc => {
          const id = doc.payload.id
          const data = doc.payload.data();
          return { id, ...data };
        })
      );
  }

  /* Writes a new chat Room document. */
  async create() {

    const data = {
      uid: 'feed', //uid of the user
      createdAt: Date.now(),
      count: 0,
      messages: []
    };

    const docRef = await this.afs.collection('chats').add(data);

    return docRef;
  }

  /* Uses the Firestore arrayUnion method append a new chat message to document. */
  async sendMessage(chatId: any, message: any) {
    const uid = chatId

    var content = message[0];
    var picture;

    //If user doesnt send a picture set picture to empty string
    if (message[1] == null){
      picture = ""
    }
    else{
      picture = message[1]
    }

    const data = {
      uid, //uid of the user
      content,
      picture,
      createdAt: Date.now()
    };

    if (uid) {
      const ref = this.afs.collection('chats').doc('feed');
      return ref.update({
        messages: firestore.firestore.FieldValue.arrayUnion(data)
      });
    }
  }

  /* Uses unique IDs from the chat messages array, then joins the user profile data to each message and keeps the entire payload synced in realtime.*/
  joinUsers(chat$: Observable<any>) {
    let chat: { messages: any[]; };
    const joinKeys: any = {};

    return chat$.pipe(
      switchMap(c => {
        // Unique User IDs
        chat = c;
        //console.log(c) //TEST------------------
        const uids = Array.from(new Set(c.messages.map((v: { uid: any; }) => v.uid)));
        //console.log(uids) //TEST--------------
        // Firestore User Doc Reads
        const userDocs = uids.map(u =>
          this.afs.doc(`users/${u}`).valueChanges()
        );
        console.log(userDocs) //TEST--------------
        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map(arr => {
        console.log(arr) //TEST--------------
        arr.forEach(v => (joinKeys[(<any>v).uid] = v));
        chat.messages = chat.messages.map(v => {
          return { ...v, user: joinKeys[v.uid] };
        });

        return chat;
      })
    );
  }

  /* Delets message from feed Collection on Firestore Database. */
  async deleteMessage(uid:any, content:any, createdAt:any, picture:any) {
    let messageRef: any;
    const db = firebase.firestore();
    messageRef = db.collection('chats').doc('feed');

    var removeMessage = messageRef.update({
      'messages': firestore.firestore.FieldValue.arrayRemove({ 'uid': uid, 'createdAt': createdAt, 'content': content, 'picture': picture })
    })

  }

}
