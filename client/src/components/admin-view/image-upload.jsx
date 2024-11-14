import React, { useRef } from 'react'
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
const PetImageUpload = ({imageFile,setImageFile,uploadedImageURL,setUploadedImageURL}) => {
    const inputRef = useRef(null);
    function handleImageFileChange(event){
        console.log(event.target.files, "event.target.files");
        const selectedFile = event.target.files?.[0];
        console.log(selectedFile);
    
        if (selectedFile) setImageFile(selectedFile);
    }
    function handleDragOver(event) {
        event.preventDefault();
    }
    
    function handleDrop(event) {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) setImageFile(droppedFile);
    }
    function handleRemoveImage() {
        setImageFile(null);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }

  return (
    <div className='w-full max-w-md mx-auto px-6 mt-4' >
        <div className='text-md font-semibold mb-2 block ' >Upload Images</div>
        <div  onDragOver={handleDragOver} onDrop={handleDrop} className='border-2 border-dashed rounded-lg p-4 '>
            <input id='image-upload' type="file" className='hidden' ref={inputRef} onChange={handleImageFileChange} />
            {
                !imageFile ?
                <label htmlFor="image-upload" className='flex flex-col items-center justify-center h-32 cursor-pointer' >
                    <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                    <span>Drag & drop or click to upload image</span>
                </label> :
                <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileIcon className="w-8 text-primary mr-2 h-8" />
                </div>
                <p className="text-sm font-medium">{imageFile.name}</p>
                <button
                  
                  className="text-zinc-700 hover:text-zinc-900"
                  onClick={handleRemoveImage}
                >
                  <XIcon className="w-4 h-4" />
                  <span className="sr-only">Remove File</span>
                </button>
              </div>
                
            }
        </div>
    </div>
  )
}

export default PetImageUpload
