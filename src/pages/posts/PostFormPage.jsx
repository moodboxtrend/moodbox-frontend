import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/common/PageHeader';
import { ImageUploadField } from '@/components/common/ImageUploadField';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { TagInput } from '@/components/common/TagInput';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useCategoryDropdown } from '@/hooks/useCategories';
import { useSubcategoryDropdown } from '@/hooks/useSubcategories';
import { usePost, useCreatePost, useUpdatePost } from '@/hooks/usePosts';
import { CONTENT_TYPES } from '@/constants/app';
import { RecipeExtraFields } from './RecipeExtraFields';
import { StoryExtraFields } from './StoryExtraFields';
import { JokeExtraFields } from './JokeExtraFields';
import { WallpaperExtraFields } from './WallpaperExtraFields';
import { VideoExtraFields } from './VideoExtraFields';

const defaultValues = {
  title: '',
  category: '',
  subcategory: '',
  contentType: 'general',
  shortDescription: '',
  content: '',
  tags: [],
  author: '',
  publishDate: new Date().toISOString().slice(0, 10),
  status: 'published',
  isFeatured: false,
  isTrending: false,
  allowSave: true,
  allowShare: true,
  recipeDetails: { ingredients: [], steps: [] },
  storyDetails: {},
  jokeDetails: {},
  wallpaperDetails: { resolution: '1080x1920', orientation: 'Portrait' },
  videoDetails: { source: 'Direct Upload' },
};

const CONTENT_REQUIRED_TYPES = ['joke', 'recipe', 'story'];

export default function PostFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const { data: postRes, isLoading: postLoading } = usePost(id);
  const { data: categoriesRes } = useCategoryDropdown();
  const categories = categoriesRes?.data || [];

  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm({ defaultValues });

  const contentType = watch('contentType');
  const selectedCategory = watch('category');
  const { data: subcategoriesRes } = useSubcategoryDropdown(selectedCategory);
  const subcategories = subcategoriesRes?.data || [];

  const { mutateAsync: createPost, isPending: creating } = useCreatePost();
  const { mutateAsync: updatePost, isPending: updating } = useUpdatePost();

  useEffect(() => {
    if (isEdit && postRes?.data) {
      const p = postRes.data;
      reset({
        title: p.title,
        category: p.category?._id || p.category,
        subcategory: p.subcategory?._id || p.subcategory,
        contentType: p.contentType,
        shortDescription: p.shortDescription || '',
        content: p.content || '',
        tags: p.tags || [],
        author: p.author?._id || p.author,
        publishDate: p.publishDate ? p.publishDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
        status: p.status || 'published',
        isFeatured: !!p.isFeatured,
        isTrending: !!p.isTrending,
        allowSave: p.allowSave !== false,
        allowShare: p.allowShare !== false,
        recipeDetails: p.recipeDetails || { ingredients: [], steps: [] },
        storyDetails: p.storyDetails || {},
        jokeDetails: p.jokeDetails || {},
        wallpaperDetails: p.wallpaperDetails || { resolution: '1080x1920', orientation: 'Portrait' },
        videoDetails: p.videoDetails || { source: 'Direct Upload' },
      });
    }
  }, [isEdit, postRes, reset]);

  // Auto-set content type when category changes
  useEffect(() => {
    const cat = categories.find((c) => c._id === selectedCategory);
    if (cat) setValue('contentType', cat.type);
  }, [selectedCategory, categories, setValue]);

  const onSubmit = async (values) => {
    if (!values.category) {
      toast.error('Please select a category');
      return;
    }
    if (!values.subcategory) {
      toast.error('Please select a subcategory');
      return;
    }

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('category', values.category);
    formData.append('subcategory', values.subcategory);
    formData.append('contentType', values.contentType);
    formData.append('shortDescription', values.shortDescription || '');
    formData.append('content', values.content || '');
    formData.append('tags', JSON.stringify(values.tags || []));
    formData.append('publishDate', values.publishDate);
    formData.append('status', values.status);
    formData.append('isFeatured', values.isFeatured);
    formData.append('isTrending', values.isTrending);
    formData.append('allowSave', values.allowSave);
    formData.append('allowShare', values.allowShare);

    if (values.contentType === 'recipe') {
      const r = values.recipeDetails || {};
      formData.append('prepTime', r.prepTime || 0);
      formData.append('cookTime', r.cookTime || 0);
      formData.append('servings', r.servings || 1);
      formData.append('difficulty', r.difficulty || 'Easy');
      formData.append('ingredients', JSON.stringify(r.ingredients || []));
      formData.append('steps', JSON.stringify(r.steps || []));
      formData.append('tips', r.tips || '');
      formData.append('nutrition', JSON.stringify(r.nutrition || {}));
    } else if (values.contentType === 'story') {
      const s = values.storyDetails || {};
      formData.append('readingTime', s.readingTime || 0);
      formData.append('storyType', s.storyType || '');
      formData.append('ageRating', s.ageRating || 'All Ages');
    } else if (values.contentType === 'joke') {
      const j = values.jokeDetails || {};
      formData.append('language', j.language || '');
    } else if (values.contentType === 'wallpaper') {
      const w = values.wallpaperDetails || {};
      formData.append('resolution', w.resolution || '1080x1920');
      formData.append('orientation', w.orientation || 'Portrait');
    } else if (values.contentType === 'video') {
      const v = values.videoDetails || {};
      formData.append('videoUrl', v.videoUrl || '');
      formData.append('videoSource', v.source || 'Direct Upload');
      formData.append('duration', v.duration || 0);
    }

    if (imageFile) formData.append('featuredImage', imageFile);
    if (videoFile && values.contentType === 'video') {
      formData.append('videoFile', videoFile);
    }

    try {
      if (isEdit) {
        await updatePost({ id, formData });
        toast.success('Post updated successfully!');
      } else {
        await createPost(formData);
        toast.success('Post created successfully!');
      }
      navigate('/posts');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Operation failed';
      toast.error(msg);
    }
  };

  const isSubmitting = creating || updating;

  if (isEdit && postLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit Post' : 'New Post'}
        description="Create content for jokes, recipes, stories, wallpapers, or videos"
        actions={
          <>
            <Button variant="outline" onClick={() => navigate('/posts')}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isEdit ? 'Save changes' : 'Create post'}
            </Button>
          </>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" placeholder="Post title" {...register('title', { required: 'Title is required' })} />
                {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea id="shortDescription" rows={2} maxLength={300} placeholder="A brief teaser (max 300 chars)" {...register('shortDescription')} />
              </div>

              <div className="space-y-1.5">
                <Label>
                  Full Content
                  {!CONTENT_REQUIRED_TYPES.includes(contentType) && (
                    <span className="text-muted-foreground font-normal"> (optional for {contentType})</span>
                  )}
                </Label>
                <Controller
                  control={control}
                  name="content"
                  rules={{
                    validate: (value) =>
                      !CONTENT_REQUIRED_TYPES.includes(contentType) || (!!value && value.trim() !== '') || 'Content is required',
                  }}
                  render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} placeholder="Write the full content…" />}
                />
                {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Tags</Label>
                <Controller
                  control={control}
                  name="tags"
                  render={({ field }) => <TagInput value={field.value} onChange={field.onChange} />}
                />
              </div>
            </CardContent>
          </Card>

          {contentType !== 'general' && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-display font-semibold mb-4 capitalize">{contentType} Details</h3>
                {contentType === 'recipe' && <RecipeExtraFields register={register} control={control} watch={watch} setValue={setValue} />}
                {contentType === 'story' && <StoryExtraFields register={register} watch={watch} setValue={setValue} />}
                {contentType === 'joke' && <JokeExtraFields watch={watch} setValue={setValue} />}
                {contentType === 'wallpaper' && <WallpaperExtraFields register={register} watch={watch} setValue={setValue} />}
                {contentType === 'video' && (
                  <VideoExtraFields
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    videoFile={videoFile}
                    setVideoFile={setVideoFile}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-display font-semibold">Featured Image / Thumbnail</h3>
              <ImageUploadField value={postRes?.data?.featuredImage?.url} onChange={setImageFile} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-display font-semibold">Organization</h3>

              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Controller
                  control={control}
                  name="category"
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={(v) => { field.onChange(v); setValue('subcategory', ''); }}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Subcategory *</Label>
                <Controller
                  control={control}
                  name="subcategory"
                  rules={{ required: 'Subcategory is required' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={!selectedCategory}>
                      <SelectTrigger><SelectValue placeholder="Select subcategory" /></SelectTrigger>
                      <SelectContent>
                        {subcategories.map((s) => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.subcategory && <p className="text-xs text-destructive">{errors.subcategory.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Content Type</Label>
                <Controller
                  control={control}
                  name="contentType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CONTENT_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-display font-semibold">Publishing</h3>

              <div className="space-y-1.5">
                <Label>Status</Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Publish Date</Label>
                <Input type="date" {...register('publishDate')} />
              </div>

              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="isFeatured" className="cursor-pointer">Featured</Label>
                <Controller control={control} name="isFeatured" render={({ field }) => (
                  <Switch id="isFeatured" checked={field.value} onCheckedChange={field.onChange} />
                )} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isTrending" className="cursor-pointer">Trending</Label>
                <Controller control={control} name="isTrending" render={({ field }) => (
                  <Switch id="isTrending" checked={field.value} onCheckedChange={field.onChange} />
                )} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="allowSave" className="cursor-pointer">Allow Save</Label>
                <Controller control={control} name="allowSave" render={({ field }) => (
                  <Switch id="allowSave" checked={field.value} onCheckedChange={field.onChange} />
                )} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="allowShare" className="cursor-pointer">Allow Share</Label>
                <Controller control={control} name="allowShare" render={({ field }) => (
                  <Switch id="allowShare" checked={field.value} onCheckedChange={field.onChange} />
                )} />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
