<script lang="ts">
  import { snapshot } from "$lib/utils/snapshot.svelte";
  import { onSaveShortcut } from "$lib/utils/keyboard";
  import { validateSlug, generateSlug } from "$lib/shared/logic/slugs";
  import { ArticleFormHeader, ArticleEditor, ArticleSettings } from "./article-form";

  type Author = {
    id: string;
    name: string;
    imageUrl: string | null;
  };

  type ArticleData = {
    slug: string;
    title: string;
    content: string;
    excerpt: string;
    coverUrl: string;
    authorId: string | null;
    published: boolean;
  };

  let {
    initialData = {
      slug: "",
      title: "",
      content: "",
      excerpt: "",
      coverUrl: "",
      authorId: null,
      published: false,
    },
    authors = [],
    onSubmit,
    onDelete = null,
    submitLabel = "Save",
    isSubmitting = $bindable(false),
    articleId = null,
  }: {
    initialData?: ArticleData;
    authors?: Author[];
    onSubmit: (data: ArticleData) => Promise<void>;
    onDelete?: (() => Promise<void>) | null;
    submitLabel?: string;
    isSubmitting?: boolean;
    articleId?: string | null;
  } = $props();

  let formData = $state(snapshot(() => initialData));
  let errors = $state<Record<string, string>>({});
  let showSettings = $state(false);

  function handleTitleChange(title: string) {
    if (!formData.slug || formData.slug === generateSlug(initialData.title)) {
      formData.slug = generateSlug(title);
    }
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    errors = {};

    if (!formData.title.trim()) {
      errors["title"] = "Title is required";
    }
    if (!formData.slug.trim()) {
      errors["slug"] = "Slug is required";
    } else if (!validateSlug(formData.slug)) {
      errors["slug"] = "Slug must be lowercase letters, numbers, and hyphens only";
    }
    if (!formData.content.trim()) {
      errors["content"] = "Content is required";
    }

    if (Object.keys(errors).length > 0) {
      // Show settings panel if there are errors in settings fields
      if (errors["slug"]) showSettings = true;
      return;
    }

    isSubmitting = true;
    try {
      await onSubmit(formData);
    } finally {
      isSubmitting = false;
    }
  }

  function triggerSubmit() {
    if (!isSubmitting) handleSubmit(new SubmitEvent("submit")).catch(console.error);
  }

  function openPreviewPage() {
    if (articleId) {
      window.open(`/admin/articles/${articleId}/preview`, "_blank");
    }
  }
</script>

<svelte:window onkeydown={onSaveShortcut(triggerSubmit)} />

<form onsubmit={handleSubmit} class="flex h-full flex-col">
  <ArticleFormHeader
    bind:published={formData.published}
    bind:showSettings
    {isSubmitting}
    {submitLabel}
    {articleId}
    onPreview={openPreviewPage}
  />

  <div class="flex flex-1 overflow-hidden">
    <ArticleEditor
      bind:title={formData.title}
      bind:content={formData.content}
      titleError={errors["title"]}
      contentError={errors["content"]}
      onTitleChange={handleTitleChange}
    />

    <ArticleSettings
      bind:show={showSettings}
      bind:published={formData.published}
      bind:slug={formData.slug}
      bind:authorId={formData.authorId}
      bind:excerpt={formData.excerpt}
      bind:coverUrl={formData.coverUrl}
      {authors}
      slugError={errors["slug"]}
      {onDelete}
    />
  </div>
</form>
