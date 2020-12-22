import { Component, OnInit,EventEmitter ,Output} from '@angular/core';

import{Post} from '../post.model'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostsService } from '../post.service';
import { mimeType } from './mime-type.validator';
import { ActivatedRoute, ParamMap } from '@angular/router';




@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {

  form:FormGroup;
  imagepreview:any;
  private mode='create';
  public postId:string;
   post:Post;
   isLoading=false;
  constructor(public postsService:PostsService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.form=new FormGroup({
      title:new FormControl(null,[Validators.required,Validators.min(3)]),
      content:new FormControl(null,Validators.required),
      image:new FormControl(null,{
        validators:[Validators.required],
        asyncValidators:[mimeType]
      })
    })

    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('postId')) {
        this.mode='edit';
        this.postId=paramMap.get('postId');
        this.isLoading=true;
        this.postsService.getPost(this.postId).subscribe(postData =>{
        this.isLoading=false;
          this.post = {
            id:postData._id,
            title:postData.title,
            content:postData.content,
            imagePath:postData.imagePath
          };
          this.form.patchValue({
            title: this.post.title,
            content: this.post.content,
            imagePath:this.post.imagePath
          });
        });
      }
      else {
        this.mode='create';
        this.postId= null;
      }
    })
  }
  enteredTitle='';
  enteredContent='';
//  @Output() postCreated=new EventEmitter<Post>();


onPickerImage(event:Event){
  const file=(event.target as HTMLInputElement).files[0];
  this.form.patchValue({image:file});
  this.form.get('image').updateValueAndValidity();
  const reader=new FileReader();
  reader.onload=()=>{
    this.imagepreview= reader.result;
  };
  reader.readAsDataURL(file);

}
  onAddPost(){

    this.isLoading=true;
    if(this.mode === "create"){
      this.postsService.addPost(this.form.value.title,this.form.value.content,this.form.value.image);
    }
    else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
      this.form.reset();
    }
  //  const post :Post={title:form.value.title,content:form.value.content}
  //  console.log("post added successfully",post);

  //  this.postCreated.emit(post);



  }
}
