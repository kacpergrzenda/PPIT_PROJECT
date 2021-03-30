import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import firestore from 'firebase/app';
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
          return { id: doc.payload.id, ...doc.payload.data() };
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
  async sendMessage(chatId: any, content: any) {
    const uid = chatId

    const data = {
      uid, //uid of the user
      content,
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
    const joinKeys:any = {};

    return chat$.pipe(
      switchMap(c => {
        // Unique User IDs
        chat = c;
        const uids = Array.from(new Set(c.messages.map((v: { uid: any; }) => v.uid)));

        // Firestore User Doc Reads
        const userDocs = uids.map(u =>
          this.afs.doc(`users/${u}`).valueChanges()
        );

        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map(arr => {
        arr.forEach(v => (joinKeys[(<any>v).uid] = v));
        chat.messages = chat.messages.map(v => {
          return { ...v, user: joinKeys[v.uid] };
        });

        return chat;
      })
    );
  }

}
