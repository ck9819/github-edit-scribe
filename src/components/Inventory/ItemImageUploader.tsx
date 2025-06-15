
import React, { useState } from 'react';
import { Button, Upload, Image, message } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { supabase } from '../../integrations/supabase/client';

const ItemImageUploader = ({ images, onImagesChange }) => {
  const [imageUploading, setImageUploading] = useState(false);

  const handleImageUpload = async (file) => {
    setImageUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `item-images/${fileName}`;

      console.log('Uploading file:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('item-images')
        .getPublicUrl(filePath);

      const newImage = {
        uid: Date.now(),
        name: file.name,
        status: 'done',
        url: data.publicUrl,
        path: filePath
      };

      onImagesChange([...images, newImage]);
      message.success('Image uploaded successfully');
    } catch (error) {
      console.error('Image upload error:', error);
      message.error(`Failed to upload image: ${error.message}`);
    } finally {
      setImageUploading(false);
    }
    return false;
  };

  const handleRemoveImage = async (image) => {
    try {
      if (image.path) {
        const { error } = await supabase.storage
          .from('item-images')
          .remove([image.path]);
        
        if (error) {
          console.error('Error removing from storage:', error);
        }
      }
      onImagesChange(images.filter(img => img.uid !== image.uid));
      message.success('Image removed successfully');
    } catch (error) {
      console.error('Error removing image:', error);
      message.error('Failed to remove image');
    }
  };

  return (
    <div className="space-y-4">
      <Upload
        beforeUpload={handleImageUpload}
        showUploadList={false}
        accept="image/*"
        disabled={imageUploading}
      >
        <Button icon={<UploadOutlined />} loading={imageUploading}>
          Upload Image
        </Button>
      </Upload>
      
      {images && images.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.uid} className="relative">
              <Image
                width={100}
                height={100}
                src={image.url}
                alt={image.name}
                style={{ objectFit: 'cover' }}
              />
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                className="absolute top-0 right-0"
                onClick={() => handleRemoveImage(image)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemImageUploader;
