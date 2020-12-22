import { Component, OnInit,Input, OnDestroy } from '@angular/core';
import{Post} from '../post.model';
import{Subscription} from 'rxjs';


import { PostsService } from '../post.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit,OnDestroy {
  posts :Post[]=[];
  isLoading=false;
  postsSub:Subscription;
  constructor(public postsService:PostsService) { }

  ngOnInit() {
    this.isLoading=true;
    this.postsService.getPosts();
    this.postsSub=this.postsService.getPostUpdateListener().subscribe((posts : Post[])=>{
        this.isLoading=false;
        this.posts=posts;
        console.log(this.posts,"posts");
      }
   )
  }

  onDelete(postId:string){
     this.postsService.deletePost(postId);
  }
  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }


  // posts=[
  //   {title:' first post',content:'This first post of users post'},
  //   {title:' second post',content:'This second post of users post'},
  //   {title:' third post',content:'This third post of users post'},
  // ]
}
