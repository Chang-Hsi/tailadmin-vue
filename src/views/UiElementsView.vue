<!-- src/views/UiElementsView.vue -->
<template>
  <div class="flex w-full flex-col gap-4 bg-slate-50">
    <div class="flex w-full flex-col gap-1">
      <div class="text-[22px] font-extrabold tracking-wide text-slate-900 lg:text-[26px]">
        活動編輯
      </div>
      <div class="text-sm text-slate-500">
        展示後台常見大量表單：文字、日期、圖片/影片、連結、地址、SEO、動態清單、預覽、附件列表。
      </div>
    </div>

    <div
      v-if="uiBanner.show"
      class="flex w-full items-start justify-between gap-3 rounded-xl p-4 shadow-sm ring-1"
      :class="
        uiBanner.type === 'success'
          ? 'bg-emerald-50 ring-emerald-200'
          : uiBanner.type === 'error'
          ? 'bg-rose-50 ring-rose-200'
          : 'bg-slate-50 ring-slate-200'
      "
    >
      <div class="flex min-w-0 flex-1 flex-col gap-1">
        <div class="text-sm font-bold text-slate-900">{{ uiBanner.title }}</div>
        <div class="text-sm text-slate-600">{{ uiBanner.message }}</div>
      </div>
      <Button
        label="關閉"
        severity="secondary"
        outlined
        class="whitespace-nowrap"
        @click="uiBanner.show = false"
      />
    </div>

    <div class="flex w-full flex-col gap-4 lg:flex-row lg:items-start">
      <div class="flex w-full flex-1 flex-col gap-4">
        <div
          class="flex w-full flex-col gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
        >
          <div class="flex w-full flex-col gap-1">
            <div class="text-base font-bold text-slate-900">基本資料</div>
            <div class="text-xs text-slate-500">標題、摘要、分類、標籤、狀態、排程</div>
          </div>

          <div class="flex w-full flex-col gap-6">
            <div class="flex w-full flex-col gap-1">
              <div class="text-xs font-semibold text-slate-600">標題（必填）</div>
              <InputText
                v-model="form.title"
                placeholder="例如：2026 新年限定活動"
                class="w-full"
              />
              <div v-if="errors.title" class="text-xs text-rose-600">
                {{ errors.title }}
              </div>
            </div>

            <div class="flex w-full flex-col gap-1">
              <div class="text-xs font-semibold text-slate-600">摘要（必填）</div>
              <Textarea
                v-model="form.summary"
                rows="3"
                autoResize
                class="w-full"
                placeholder="用一句話描述內容重點"
              />
              <div v-if="errors.summary" class="text-xs text-rose-600">
                {{ errors.summary }}
              </div>
            </div>

            <div class="flex w-full flex-col gap-3 lg:flex-row">
              <div class="flex w-full flex-1 flex-col gap-1">
                <div class="text-xs font-semibold text-slate-600">分類（必填）</div>
                <Dropdown
                  v-model="form.category"
                  :options="categoryOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="請選擇分類"
                  class="w-full"
                />
                <div v-if="errors.category" class="text-xs text-rose-600">
                  {{ errors.category }}
                </div>
              </div>

              <div class="flex w-full flex-1 flex-col gap-1">
                <div class="text-xs font-semibold text-slate-600">狀態</div>
                <Dropdown
                  v-model="form.status"
                  :options="statusOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="請選擇狀態"
                  class="w-full"
                />
              </div>

              <div class="flex w-full flex-1 flex-col gap-1">
                <div class="text-xs font-semibold text-slate-600">重要程度</div>
                <Dropdown
                  v-model="form.priority"
                  :options="priorityOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="一般"
                  class="w-full"
                />
              </div>
            </div>

            <div class="flex w-full flex-col gap-3 lg:flex-row">
              <div class="flex w-full flex-1 flex-col gap-1">
                <div class="text-xs font-semibold text-slate-600">標籤（可多選）</div>
                <MultiSelect
                  v-model="form.tags"
                  :options="tagOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="選擇標籤"
                  class="w-full"
                  display="chip"
                />
              </div>

              <div class="flex w-full flex-1 flex-col gap-1">
                <div class="text-xs font-semibold text-slate-600">
                  自訂標籤（自由輸入）
                </div>
                <Chips
                  v-model="form.customTags"
                  class="w-full"
                  placeholder="輸入後按 Enter"
                />
              </div>
            </div>

            <div class="flex w-full flex-col gap-3 lg:flex-row">
              <div class="flex w-full flex-1 flex-col gap-1">
                <div class="text-xs font-semibold text-slate-600">上架時間（必填）</div>
                <Calendar
                  v-model="form.publishAt"
                  showIcon
                  showTime
                  hourFormat="24"
                  dateFormat="yy-mm-dd"
                  :manualInput="false"
                  placeholder="選擇上架時間"
                  class="w-full"
                />
                <div v-if="errors.publishAt" class="text-xs text-rose-600">
                  {{ errors.publishAt }}
                </div>
              </div>

              <div class="flex w-full flex-1 flex-col gap-1">
                <div class="text-xs font-semibold text-slate-600">下架時間（可選）</div>
                <Calendar
                  v-model="form.unpublishAt"
                  showIcon
                  showTime
                  hourFormat="24"
                  dateFormat="yy-mm-dd"
                  :manualInput="false"
                  placeholder="選擇下架時間"
                  class="w-full"
                />
              </div>

              <div class="flex w-full flex-1 flex-col gap-1">
                <div class="text-xs font-semibold text-slate-600">排序權重</div>
                <InputNumber
                  v-model="form.sortWeight"
                  :min="0"
                  :max="9999"
                  class="w-full"
                />
              </div>
            </div>

            <div
              class="flex w-full flex-col gap-2 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200"
            >
              <div class="flex w-full items-center justify-between gap-2">
                <div class="text-sm font-bold text-slate-800">快速選項</div>
                <div class="text-xs text-slate-500">勾選會影響預覽標籤顯示</div>
              </div>
              <div class="flex w-full flex-wrap items-center gap-3">
                <div class="flex items-center gap-2">
                  <Checkbox
                    v-model="form.flags.isPinned"
                    :binary="true"
                    inputId="flagPinned"
                  />
                  <label for="flagPinned" class="text-sm text-slate-700">置頂</label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox
                    v-model="form.flags.isFeatured"
                    :binary="true"
                    inputId="flagFeatured"
                  />
                  <label for="flagFeatured" class="text-sm text-slate-700">精選</label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox
                    v-model="form.flags.allowComments"
                    :binary="true"
                    inputId="flagComments"
                  />
                  <label for="flagComments" class="text-sm text-slate-700"
                    >允許留言</label
                  >
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox
                    v-model="form.flags.isMembersOnly"
                    :binary="true"
                    inputId="flagMembersOnly"
                  />
                  <label for="flagMembersOnly" class="text-sm text-slate-700"
                    >會員限定</label
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex w-full flex-col gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
        >
          <div class="flex w-full flex-col gap-1">
            <div class="text-base font-bold text-slate-900">媒體上傳</div>
            <div class="text-xs text-slate-500">封面圖、多圖、影片（檔案或連結擇一）</div>
          </div>

          <TabView class="w-full">
            <TabPanel header="封面圖">
              <div class="flex w-full flex-col gap-3">
                <div class="flex w-full flex-col gap-3">
                  <div class="text-xs font-semibold text-slate-600">
                    封面圖（建議 16:9）
                  </div>
                  <FileUpload
                    mode="basic"
                    chooseLabel="選擇圖片"
                    accept="image/*"
                    :maxFileSize="8 * 1024 * 1024"
                    customUpload
                    @uploader="onCoverUpload"
                  />
                  <div class="text-xs text-slate-500">
                    你也可以改用「圖片 URL」：適合串 CDN
                  </div>
                </div>

                <div class="flex w-full flex-col gap-1">
                  <div class="text-xs font-semibold text-slate-600">圖片 URL（可選）</div>
                  <InputText
                    v-model="form.coverUrl"
                    placeholder="https://..."
                    class="w-full"
                    @blur="syncCoverFromUrl()"
                  />
                </div>

                <div v-if="errors.cover" class="text-xs text-rose-600">
                  {{ errors.cover }}
                </div>

                <div class="flex w-full items-center gap-2">
                  <Button
                    label="移除封面"
                    severity="secondary"
                    outlined
                    @click="removeCover()"
                  />
                  <div class="text-xs text-slate-500">目前：{{ coverState.label }}</div>
                </div>
              </div>
            </TabPanel>

            <TabPanel header="多圖相簿">
              <div class="flex w-full flex-col gap-3">
                <div class="flex w-full flex-col gap-3">
                  <div class="text-xs font-semibold text-slate-600">
                    相簿圖片（最多 8 張）
                  </div>
                  <FileUpload
                    mode="basic"
                    chooseLabel="選擇多張圖片"
                    accept="image/*"
                    :maxFileSize="8 * 1024 * 1024"
                    customUpload
                    @uploader="onGalleryUpload"
                  />
                  <div class="text-xs text-slate-500">
                    這裡用靜態假資料演示：上傳後會進入附件列表與預覽
                  </div>
                </div>

                <div class="flex w-full flex-wrap gap-2">
                  <Tag
                    v-for="(x, idx) in galleryState.items"
                    :key="x.key"
                    severity="secondary"
                    :value="`圖 ${idx + 1}`"
                  />
                  <div
                    v-if="galleryState.items.length === 0"
                    class="text-xs text-slate-500"
                  >
                    尚未選擇相簿圖片
                  </div>
                </div>

                <div class="flex w-full items-center gap-2">
                  <Button
                    label="清空相簿"
                    severity="secondary"
                    outlined
                    @click="clearGallery()"
                  />
                  <div class="text-xs text-slate-500">
                    目前：{{ galleryState.items.length }} 張
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel header="影片">
              <div class="flex w-full flex-col gap-3">
                <div class="flex w-full flex-col gap-3">
                  <div class="text-xs font-semibold text-slate-600">影片上傳（可選）</div>
                  <FileUpload
                    mode="basic"
                    chooseLabel="選擇影片"
                    accept="video/*"
                    :maxFileSize="50 * 1024 * 1024"
                    customUpload
                    @uploader="onVideoUpload"
                  />
                  <div class="text-xs text-slate-500">
                    你也可以改用「影片連結」：YouTube / Vimeo / mp4 直連都行
                  </div>
                </div>

                <div class="flex w-full flex-col gap-1">
                  <div class="text-xs font-semibold text-slate-600">影片連結（可選）</div>
                  <InputText
                    v-model="form.videoUrl"
                    placeholder="https://..."
                    class="w-full"
                    @blur="syncVideoFromUrl()"
                  />
                </div>

                <div class="flex w-full items-center gap-2">
                  <Button
                    label="移除影片"
                    severity="secondary"
                    outlined
                    @click="removeVideo()"
                  />
                  <div class="text-xs text-slate-500">目前：{{ videoState.label }}</div>
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>

        <div
          class="flex w-full flex-col gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
        >
          <div class="flex w-full flex-col gap-1">
            <div class="text-base font-bold text-slate-900">內容與連結</div>
            <div class="text-xs text-slate-500">
              內文（Tiptap）、外部連結清單（可新增/移除）
            </div>
          </div>

          <div class="flex w-full flex-col gap-3">
            <div class="flex w-full flex-col gap-2">
              <div class="text-xs font-semibold text-slate-600">內文</div>

              <div
                class="flex w-full flex-wrap items-center gap-2 rounded-lg bg-slate-50 p-2 ring-1 ring-slate-200"
              >
                <Button
                  label="粗體"
                  severity="secondary"
                  :outlined="!(editor && editor.isActive('bold'))"
                  size="small"
                  @click="editor && editor.chain().focus().toggleBold().run()"
                />
                <Button
                  label="斜體"
                  severity="secondary"
                  :outlined="!(editor && editor.isActive('italic'))"
                  size="small"
                  @click="editor && editor.chain().focus().toggleItalic().run()"
                />
                <Button
                  label="項目符號"
                  severity="secondary"
                  :outlined="!(editor && editor.isActive('bulletList'))"
                  size="small"
                  @click="editor && editor.chain().focus().toggleBulletList().run()"
                />
                <Button
                  label="編號清單"
                  severity="secondary"
                  :outlined="!(editor && editor.isActive('orderedList'))"
                  size="small"
                  @click="editor && editor.chain().focus().toggleOrderedList().run()"
                />
                <Button
                  label="引用"
                  severity="secondary"
                  :outlined="!(editor && editor.isActive('blockquote'))"
                  size="small"
                  @click="editor && editor.chain().focus().toggleBlockquote().run()"
                />
                <Button
                  label="連結"
                  severity="secondary"
                  size="small"
                  @click="setLink()"
                />
                <Button
                  label="取消連結"
                  severity="secondary"
                  outlined
                  size="small"
                  @click="unsetLink()"
                />
                <Button
                  label="插入圖片URL"
                  severity="secondary"
                  outlined
                  size="small"
                  @click="insertImageByUrl()"
                />

                <div class="flex-1"></div>

                <Button
                  label="復原"
                  severity="secondary"
                  outlined
                  size="small"
                  :disabled="!(editor && editor.can().chain().focus().undo().run())"
                  @click="editor && editor.chain().focus().undo().run()"
                />
                <Button
                  label="重做"
                  severity="secondary"
                  outlined
                  size="small"
                  :disabled="!(editor && editor.can().chain().focus().redo().run())"
                  @click="editor && editor.chain().focus().redo().run()"
                />
              </div>

              <div class="w-full rounded-lg bg-white p-3 ring-1 ring-slate-200">
                <EditorContent :editor="editor" class="tiptap-editor" />
              </div>
            </div>

            <Divider />

            <div class="flex w-full items-center justify-between gap-2">
              <div class="text-sm font-bold text-slate-900">外部連結</div>
              <Button
                label="新增連結"
                icon="pi pi-plus"
                @click="addLink()"
                size="small"
              />
            </div>

            <div class="flex w-full flex-col gap-3">
              <div
                v-for="(link, idx) in form.links"
                :key="link.id"
                class="flex w-full flex-col gap-2 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200"
              >
                <div class="flex w-full items-center justify-between gap-2">
                  <div class="text-sm font-semibold text-slate-800">
                    連結 {{ idx + 1 }}
                  </div>
                  <Button
                    label="移除"
                    severity="danger"
                    outlined
                    @click="removeLink(link.id)"
                  />
                </div>

                <div class="flex w-full flex-col gap-3 lg:flex-row">
                  <div class="flex w-full flex-1 flex-col gap-1">
                    <div class="text-xs font-semibold text-slate-600">標題</div>
                    <InputText
                      v-model="link.title"
                      placeholder="例如：活動規則"
                      class="w-full"
                    />
                  </div>

                  <div class="flex w-full flex-2 flex-col gap-1">
                    <div class="text-xs font-semibold text-slate-600">URL</div>
                    <InputText
                      v-model="link.url"
                      placeholder="https://..."
                      class="w-full"
                    />
                  </div>

                  <div class="flex w-full flex-1 flex-col gap-1">
                    <div class="text-xs font-semibold text-slate-600">類型</div>
                    <Dropdown
                      v-model="link.type"
                      :options="linkTypeOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="一般"
                      class="w-full"
                    />
                  </div>
                </div>

                <div class="flex w-full flex-wrap items-center gap-3 mt-2">
                  <div class="flex items-center gap-2">
                    <Checkbox
                      v-model="link.isPrimary"
                      :binary="true"
                      :inputId="`linkPrimary-${link.id}`"
                    />
                    <label :for="`linkPrimary-${link.id}`" class="text-sm text-slate-700"
                      >主要連結</label
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <Checkbox
                      v-model="link.openInNewTab"
                      :binary="true"
                      :inputId="`linkNewTab-${link.id}`"
                    />
                    <label :for="`linkNewTab-${link.id}`" class="text-sm text-slate-700"
                      >新分頁開啟</label
                    >
                  </div>
                  <div class="text-xs text-slate-500">建議：主要連結最多 1 個</div>
                </div>

                <div v-if="linkErrors[link.id]" class="text-xs text-rose-600">
                  {{ linkErrors[link.id] }}
                </div>
              </div>

              <div v-if="form.links.length === 0" class="text-sm text-slate-500">
                尚未新增連結
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex w-full flex-col gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
        >
          <div class="flex w-full flex-col gap-1">
            <div class="text-base font-bold text-slate-900">地址與地圖連結</div>
            <div class="text-xs text-slate-500">
              縣市區、詳細地址、快速產生 Google Maps 搜尋連結
            </div>
          </div>

          <div class="flex w-full flex-col gap-3">
            <div class="flex w-full flex-col gap-3 lg:flex-row">
              <div class="flex w-full flex-1 flex-col gap-3">
                <div class="text-xs font-semibold text-slate-600">縣市</div>
                <Dropdown
                  v-model="form.address.city"
                  :options="cityOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="選擇縣市"
                  class="w-full"
                  @change="onCityChanged()"
                />
              </div>

              <div class="flex w-full flex-1 flex-col gap-1">
                <div class="text-xs font-semibold text-slate-600">區域</div>
                <Dropdown
                  v-model="form.address.district"
                  :options="districtOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="選擇區域"
                  class="w-full"
                />
              </div>

              <div class="flex w-full flex-2 flex-col gap-1">
                <div class="text-xs font-semibold text-slate-600">詳細地址</div>
                <InputText
                  v-model="form.address.detail"
                  placeholder="例如：中壢區中正路 100 號"
                  class="w-full"
                />
              </div>
            </div>

            <div class="flex w-full flex-col gap-3 lg:flex-row">
              <div class="flex w-full flex-1 flex-col gap-1">
                <div class="text-xs font-semibold text-slate-600">地址備註（可選）</div>
                <InputText
                  v-model="form.address.note"
                  placeholder="例如：入口在巷內"
                  class="w-full"
                />
              </div>

              <div class="flex w-full flex-1 flex-col gap-1">
                <div class="text-xs font-semibold text-slate-600">
                  地圖連結（自動產生，可手改）
                </div>
                <InputText
                  v-model="form.address.mapUrl"
                  placeholder="https://www.google.com/maps/search/..."
                  class="w-full"
                />
              </div>
            </div>

            <div class="flex w-full items-center gap-2">
              <Button
                label="產生地圖連結"
                severity="secondary"
                @click="generateMapUrl()"
              />
              <Button
                label="清除地址"
                severity="secondary"
                outlined
                @click="clearAddress()"
              />
              <a
                v-if="form.address.mapUrl"
                class="text-sm font-semibold text-indigo-700 underline"
                :href="form.address.mapUrl"
                target="_blank"
                rel="noreferrer"
              >
                開啟地圖
              </a>
            </div>
          </div>
        </div>

        <div
          class="flex w-full flex-col gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
        >
          <div class="flex w-full flex-col gap-1">
            <div class="text-base font-bold text-slate-900">SEO / 分享卡片</div>
            <div class="text-xs text-slate-500">
              Meta Title、Meta Description、OG Image（可用封面圖）
            </div>
          </div>

          <div class="flex w-full flex-col gap-3">
            <div class="flex w-full flex-col gap-1">
              <div class="text-xs font-semibold text-slate-600">Meta Title</div>
              <InputText
                v-model="form.seo.metaTitle"
                placeholder="若留空，預設使用標題"
                class="w-full"
              />
            </div>

            <div class="flex w-full flex-col gap-1">
              <div class="text-xs font-semibold text-slate-600">Meta Description</div>
              <Textarea
                v-model="form.seo.metaDescription"
                rows="3"
                autoResize
                class="w-full"
                placeholder="若留空，預設使用摘要"
              />
            </div>

            <div
              class="flex w-full flex-col gap-2 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200"
            >
              <div class="flex w-full items-center justify-between gap-2">
                <div class="text-sm font-bold text-slate-800">OG Image</div>
                <div class="flex items-center gap-2">
                  <Checkbox
                    v-model="form.seo.useCoverAsOg"
                    :binary="true"
                    inputId="useCoverOg"
                  />
                  <label for="useCoverOg" class="text-sm text-slate-700"
                    >使用封面圖</label
                  >
                </div>
              </div>

              <div class="flex w-full flex-col gap-1">
                <div class="text-xs font-semibold text-slate-600">
                  OG Image URL（可選）
                </div>
                <InputText
                  v-model="form.seo.ogImageUrl"
                  placeholder="https://..."
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex w-full flex-wrap items-center justify-end gap-2 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
        >
          <Button
            label="套用範例資料"
            severity="secondary"
            outlined
            @click="fillExample()"
          />
          <Button label="重置表單" severity="secondary" outlined @click="resetForm()" />
          <Button label="儲存草稿" severity="secondary" @click="saveDraft()" />
          <Button label="發布" @click="publish()" />
        </div>

        <div
          class="flex w-full flex-col gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
        >
          <div class="flex w-full items-center justify-between gap-2">
            <div class="flex flex-col">
              <div class="text-base font-bold text-slate-900">附件列表</div>
              <div class="text-xs text-slate-500">
                圖片/影片上傳後會進入附件清單（示範用）
              </div>
            </div>
            <Button
              label="清空附件"
              severity="secondary"
              outlined
              @click="clearAttachments()"
            />
          </div>

          <DataTable
            :value="attachmentsRows"
            size="small"
            scrollable
            scrollHeight="260px"
            stripedRows
            class="w-full"
          >
            <Column field="name" header="檔名" style="min-width: 240px" />
            <Column field="type" header="類型" style="min-width: 160px" />
            <Column field="sizeText" header="大小" style="min-width: 110px" />
            <Column field="source" header="來源" style="min-width: 120px" />
            <Column header="操作" style="min-width: 120px">
              <template #body="{ data }">
                <div class="flex items-center gap-2">
                  <Button
                    label="移除"
                    severity="danger"
                    outlined
                    size="small"
                    @click="removeAttachment(data.id)"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>

      <div class="flex w-full lg:w-105 lg:min-w-105">
        <div
          class="flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-6"
        >
          <div class="flex w-full items-center justify-between">
            <div class="text-base font-bold text-slate-900">即時預覽</div>
            <Tag severity="secondary" :value="previewBadgeText" />
          </div>

          <div
            class="flex w-full flex-col overflow-hidden rounded-xl ring-1 ring-slate-200"
          >
            <div class="flex w-full flex-col bg-white">
              <div
                class="flex w-full items-center justify-between gap-2 bg-slate-50 px-4 py-3"
              >
                <div class="flex min-w-0 flex-1 flex-col gap-1">
                  <div class="truncate text-sm font-bold text-slate-900">
                    {{ preview.title }}
                  </div>
                  <div class="flex flex-wrap items-center gap-2">
                    <Tag :severity="preview.statusSeverity" :value="preview.statusText" />
                    <Tag v-if="preview.isPinned" severity="info" value="置頂" />
                    <Tag v-if="preview.isFeatured" severity="success" value="精選" />
                    <Tag
                      v-if="preview.isMembersOnly"
                      severity="warning"
                      value="會員限定"
                    />
                  </div>
                </div>
                <div class="text-xs text-slate-500">{{ preview.publishText }}</div>
              </div>

              <div v-if="preview.coverPreviewUrl" class="flex w-full">
                <img
                  :src="preview.coverPreviewUrl"
                  alt="cover"
                  class="h-45 w-full object-cover"
                />
              </div>
              <div
                v-else
                class="flex w-full items-center justify-center bg-slate-100 py-10 text-sm text-slate-500"
              >
                尚未設定封面圖
              </div>

              <div class="flex w-full flex-col gap-3 px-4 py-4">
                <div class="text-sm text-slate-700">{{ preview.summary }}</div>

                <div class="flex w-full flex-col gap-2">
                  <div class="text-xs font-semibold text-slate-600">分類 / 標籤</div>
                  <div class="flex w-full flex-wrap items-center gap-2">
                    <Tag severity="secondary" :value="preview.categoryText" />
                    <Tag
                      v-for="t in preview.tagsText"
                      :key="t"
                      severity="secondary"
                      :value="t"
                    />
                    <div
                      v-if="preview.tagsText.length === 0"
                      class="text-xs text-slate-500"
                    >
                      （無）
                    </div>
                  </div>
                </div>

                <div class="flex w-full flex-col gap-2">
                  <div class="text-xs font-semibold text-slate-600">內容</div>
                  <div
                    class="tiptap-preview text-sm text-slate-700"
                    v-html="preview.contentHtml"
                  ></div>
                </div>

                <div class="flex w-full flex-col gap-2">
                  <div class="text-xs font-semibold text-slate-600">相簿</div>
                  <div
                    v-if="preview.galleryPreviewUrls.length > 0"
                    class="flex w-full flex-wrap gap-2"
                  >
                    <img
                      v-for="x in preview.galleryPreviewUrls"
                      :key="x"
                      :src="x"
                      alt="gallery"
                      class="h-14 w-14 rounded-lg object-cover ring-1 ring-slate-200"
                    />
                  </div>
                  <div v-else class="text-xs text-slate-500">（無）</div>
                </div>

                <div class="flex w-full flex-col gap-2">
                  <div class="text-xs font-semibold text-slate-600">影片</div>
                  <div v-if="preview.videoPreviewUrl" class="flex w-full flex-col gap-2">
                    <video
                      v-if="preview.videoIsFile"
                      :src="preview.videoPreviewUrl"
                      controls
                      class="w-full rounded-lg ring-1 ring-slate-200"
                    />
                    <a
                      v-else
                      class="text-sm font-semibold text-indigo-700 underline"
                      :href="preview.videoPreviewUrl"
                      target="_blank"
                      rel="noreferrer"
                    >
                      開啟影片連結
                    </a>
                  </div>
                  <div v-else class="text-xs text-slate-500">（無）</div>
                </div>

                <div class="flex w-full flex-col gap-2">
                  <div class="text-xs font-semibold text-slate-600">外部連結</div>
                  <div v-if="preview.links.length > 0" class="flex w-full flex-col gap-2">
                    <a
                      v-for="x in preview.links"
                      :key="x.id"
                      class="flex w-full items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200"
                      :href="x.url"
                      :target="x.openInNewTab ? '_blank' : '_self'"
                      rel="noreferrer"
                    >
                      <div class="flex min-w-0 flex-1 flex-col gap-1">
                        <div class="truncate text-sm font-semibold text-slate-800">
                          {{ x.title || x.url }}
                        </div>
                        <div class="truncate text-xs text-slate-500">{{ x.url }}</div>
                      </div>
                      <Tag v-if="x.isPrimary" severity="info" value="主要" />
                    </a>
                  </div>
                  <div v-else class="text-xs text-slate-500">（無）</div>
                </div>

                <div class="flex w-full flex-col gap-2">
                  <div class="text-xs font-semibold text-slate-600">地址</div>
                  <div class="text-sm text-slate-700">{{ preview.addressText }}</div>
                  <a
                    v-if="preview.mapUrl"
                    class="text-sm font-semibold text-indigo-700 underline"
                    :href="preview.mapUrl"
                    target="_blank"
                    rel="noreferrer"
                  >
                    開啟 Google Maps
                  </a>
                </div>

                <div
                  class="flex w-full flex-col gap-2 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200"
                >
                  <div class="text-xs font-semibold text-slate-700">SEO 預覽</div>
                  <div class="text-sm font-bold text-slate-900">
                    {{ preview.seoTitle }}
                  </div>
                  <div class="text-xs text-slate-500">{{ preview.seoDescription }}</div>
                  <div class="text-xs text-slate-500">OG：{{ preview.ogImageText }}</div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="flex w-full flex-col gap-2 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200"
          >
            <div class="text-sm font-bold text-slate-800">狀態摘要</div>
            <div class="flex w-full flex-col gap-1 text-sm text-slate-700">
              <div class="flex w-full items-center justify-between">
                <span>附件數</span>
                <span class="font-semibold">{{ attachmentsRows.length }}</span>
              </div>
              <div class="flex w-full items-center justify-between">
                <span>連結數</span>
                <span class="font-semibold">{{ form.links.length }}</span>
              </div>
              <div class="flex w-full items-center justify-between">
                <span>排序權重</span>
                <span class="font-semibold">{{ form.sortWeight }}</span>
              </div>
            </div>
          </div>

          <div class="flex w-full flex-col gap-2">
            <Button label="發布" class="w-full" @click="publish()" />
            <Button
              label="儲存草稿"
              severity="secondary"
              class="w-full"
              @click="saveDraft()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, watch } from "vue";

import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import Chips from "primevue/chips";
import Calendar from "primevue/calendar";
import InputNumber from "primevue/inputnumber";
import Checkbox from "primevue/checkbox";
import FileUpload from "primevue/fileupload";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Divider from "primevue/divider";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

import { EditorContent, useEditor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

const categoryOptions = [
  { label: "活動", value: "event" },
  { label: "公告", value: "notice" },
  { label: "文章", value: "post" },
  { label: "商品", value: "product" },
  { label: "FAQ", value: "faq" },
];

const statusOptions = [
  { label: "草稿", value: "draft" },
  { label: "已排程", value: "scheduled" },
  { label: "已上架", value: "published" },
  { label: "已下架", value: "unpublished" },
];

const priorityOptions = [
  { label: "一般", value: "normal" },
  { label: "重要", value: "high" },
  { label: "緊急", value: "urgent" },
];

const tagOptions = [
  { label: "新年", value: "新年" },
  { label: "折扣", value: "折扣" },
  { label: "會員", value: "會員" },
  { label: "限時", value: "限時" },
  { label: "熱門", value: "熱門" },
  { label: "系統維護", value: "系統維護" },
  { label: "上架排程", value: "上架排程" },
];

const linkTypeOptions = [
  { label: "一般", value: "normal" },
  { label: "活動規則", value: "rules" },
  { label: "報名連結", value: "register" },
  { label: "客服", value: "support" },
  { label: "外部文章", value: "article" },
];

const cityOptions = [
  { label: "桃園市", value: "桃園市" },
  { label: "臺北市", value: "臺北市" },
  { label: "新北市", value: "新北市" },
  { label: "臺中市", value: "臺中市" },
];

const cityDistrictMap = {
  桃園市: ["中壢區", "桃園區", "八德區", "平鎮區", "蘆竹區"],
  臺北市: ["中山區", "大安區", "信義區", "內湖區", "松山區"],
  新北市: ["板橋區", "新莊區", "三重區", "永和區", "新店區"],
  臺中市: ["西屯區", "北區", "南屯區", "北屯區", "南區"],
};

function nowPlusMinutes(min) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + min);
  return d;
}

function uid(prefix) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

const form = reactive({
  title: "",
  summary: "",
  category: null,
  status: "draft",
  priority: "normal",
  tags: [],
  customTags: [],
  publishAt: nowPlusMinutes(30),
  unpublishAt: null,
  sortWeight: 0,
  flags: {
    isPinned: false,
    isFeatured: false,
    allowComments: true,
    isMembersOnly: false,
  },
  coverUrl: "",
  videoUrl: "",
  content: "",
  links: [
    {
      id: uid("link"),
      title: "活動規則",
      url: "https://example.com/rules",
      type: "rules",
      isPrimary: true,
      openInNewTab: true,
    },
  ],
  address: {
    city: "桃園市",
    district: "中壢區",
    detail: "",
    note: "",
    mapUrl: "",
  },
  seo: {
    metaTitle: "",
    metaDescription: "",
    useCoverAsOg: true,
    ogImageUrl: "",
  },
});

const errors = reactive({
  title: "",
  summary: "",
  category: "",
  publishAt: "",
  cover: "",
});

const linkErrors = reactive({});

const uiBanner = reactive({
  show: false,
  type: "info",
  title: "",
  message: "",
});

function showBanner(type, title, message) {
  uiBanner.show = true;
  uiBanner.type = type;
  uiBanner.title = title;
  uiBanner.message = message;
}

const editorRef = useEditor({
  content: form.content || "",
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: "輸入內文內容…（可貼上文字、可用工具列格式化）",
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
    }),
    Image,
  ],
  onUpdate({ editor }) {
    form.content = editor.getHTML();
  },
});

const editor = computed(() => editorRef.value);

function syncEditorFromFormContent() {
  if (!editorRef.value) return;
  const html = String(form.content || "");
  if (editorRef.value.getHTML() !== html) {
    editorRef.value.commands.setContent(html || "", false);
  }
}

function setLink() {
  if (!editorRef.value) return;

  const prev = editorRef.value.getAttributes("link").href || "";
  const url = window.prompt("請輸入連結 URL（需含 http/https）", prev);
  if (url === null) return;

  const v = String(url || "").trim();
  if (!v) {
    editorRef.value.chain().focus().unsetLink().run();
    return;
  }
  if (!/^https?:\/\/.+/i.test(v)) {
    showBanner("error", "連結格式錯誤", "URL 需以 http:// 或 https:// 開頭");
    return;
  }

  editorRef.value.chain().focus().extendMarkRange("link").setLink({ href: v }).run();
}

function unsetLink() {
  if (!editorRef.value) return;
  editorRef.value.chain().focus().unsetLink().run();
}

function insertImageByUrl() {
  if (!editorRef.value) return;

  const url = window.prompt("請輸入圖片 URL（需含 http/https）", "");
  if (url === null) return;

  const v = String(url || "").trim();
  if (!v) return;
  if (!/^https?:\/\/.+/i.test(v)) {
    showBanner("error", "圖片 URL 格式錯誤", "URL 需以 http:// 或 https:// 開頭");
    return;
  }

  editorRef.value.chain().focus().setImage({ src: v }).run();
}

const coverState = reactive({
  file: null,
  objectUrl: "",
  label: "未設定",
});

const galleryState = reactive({
  items: [],
});

const videoState = reactive({
  file: null,
  objectUrl: "",
  label: "未設定",
});

const attachments = reactive({
  items: [],
});

const attachmentsRows = computed(() => {
  return attachments.items.map((x) => ({
    id: x.id,
    name: x.name,
    type: x.type,
    sizeText: formatBytes(x.size),
    source: x.source,
    raw: x.raw,
  }));
});

function formatBytes(bytes) {
  const n = Number(bytes || 0);
  if (n <= 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(n) / Math.log(k));
  const v = n / Math.pow(k, i);
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${sizes[i]}`;
}

function safeRevoke(url) {
  try {
    if (url) URL.revokeObjectURL(url);
  } catch (e) {}
}

function addAttachmentFromFile(file, source) {
  attachments.items.push({
    id: uid("att"),
    name: file.name,
    type: file.type || "unknown",
    size: file.size || 0,
    source,
    raw: file,
  });
}

function onCoverUpload(event) {
  const files = event?.files || [];
  if (!files.length) return;

  const file = files[0];
  if (!file || !String(file.type || "").startsWith("image/")) {
    showBanner("error", "封面上傳失敗", "請選擇圖片檔案");
    return;
  }

  setCoverFile(file);
  addAttachmentFromFile(file, "cover");
  showBanner("success", "封面已更新", `已選擇：${file.name}`);
}

function onGalleryUpload(event) {
  const files = event?.files || [];
  if (!files.length) return;

  const images = files.filter((f) => String(f.type || "").startsWith("image/"));
  if (!images.length) {
    showBanner("error", "相簿上傳失敗", "請選擇圖片檔案");
    return;
  }

  const remain = Math.max(0, 8 - galleryState.items.length);
  const pick = images.slice(0, remain);

  pick.forEach((file) => {
    const obj = URL.createObjectURL(file);
    const item = { key: uid("gallery"), file, objectUrl: obj };
    galleryState.items.push(item);
    addAttachmentFromFile(file, "gallery");
  });

  if (images.length > remain)
    showBanner("info", "相簿已達上限", "最多 8 張，超出的已忽略");
  else showBanner("success", "相簿已更新", `新增 ${pick.length} 張`);
}

function onVideoUpload(event) {
  const files = event?.files || [];
  if (!files.length) return;

  const file = files[0];
  if (!file || !String(file.type || "").startsWith("video/")) {
    showBanner("error", "影片上傳失敗", "請選擇影片檔案");
    return;
  }

  setVideoFile(file);
  addAttachmentFromFile(file, "video");
  showBanner("success", "影片已更新", `已選擇：${file.name}`);
}

function setCoverFile(file) {
  if (coverState.objectUrl) safeRevoke(coverState.objectUrl);
  coverState.file = file;
  coverState.objectUrl = URL.createObjectURL(file);
  coverState.label = file?.name || "未設定";
  form.coverUrl = "";
}

function syncCoverFromUrl() {
  const url = String(form.coverUrl || "").trim();
  if (!url) return;
  if (coverState.objectUrl) safeRevoke(coverState.objectUrl);
  coverState.file = null;
  coverState.objectUrl = "";
  coverState.label = "使用 URL";
}

function removeCover() {
  if (coverState.objectUrl) safeRevoke(coverState.objectUrl);
  coverState.file = null;
  coverState.objectUrl = "";
  coverState.label = "未設定";
  form.coverUrl = "";
}

function clearGallery() {
  galleryState.items.forEach((x) => safeRevoke(x.objectUrl));
  galleryState.items = [];
  showBanner("info", "已清空相簿", "相簿圖片已清空");
}

function setVideoFile(file) {
  if (videoState.objectUrl) safeRevoke(videoState.objectUrl);
  videoState.file = file;
  videoState.objectUrl = URL.createObjectURL(file);
  videoState.label = file?.name || "未設定";
  form.videoUrl = "";
}

function syncVideoFromUrl() {
  const url = String(form.videoUrl || "").trim();
  if (!url) return;
  if (videoState.objectUrl) safeRevoke(videoState.objectUrl);
  videoState.file = null;
  videoState.objectUrl = "";
  videoState.label = "使用連結";
}

function removeVideo() {
  if (videoState.objectUrl) safeRevoke(videoState.objectUrl);
  videoState.file = null;
  videoState.objectUrl = "";
  videoState.label = "未設定";
  form.videoUrl = "";
}

function removeAttachment(id) {
  const idx = attachments.items.findIndex((x) => x.id === id);
  if (idx < 0) return;

  const item = attachments.items[idx];
  attachments.items.splice(idx, 1);

  if (item.source === "cover" && coverState.file && item.name === coverState.file.name) {
    removeCover();
  }
  if (item.source === "video" && videoState.file && item.name === videoState.file.name) {
    removeVideo();
  }
  if (item.source === "gallery") {
    const gIdx = galleryState.items.findIndex((g) => g.file?.name === item.name);
    if (gIdx >= 0) {
      safeRevoke(galleryState.items[gIdx].objectUrl);
      galleryState.items.splice(gIdx, 1);
    }
  }
}

function clearAttachments() {
  attachments.items = [];
  showBanner("info", "已清空附件", "附件列表已清空");
}

function addLink() {
  form.links.push({
    id: uid("link"),
    title: "",
    url: "",
    type: "normal",
    isPrimary: false,
    openInNewTab: true,
  });
}

function removeLink(id) {
  const idx = form.links.findIndex((x) => x.id === id);
  if (idx < 0) return;
  form.links.splice(idx, 1);
  delete linkErrors[id];
}

function validateLinks() {
  const map = {};
  let primaryCount = 0;

  form.links.forEach((l) => {
    const title = String(l.title || "").trim();
    const url = String(l.url || "").trim();

    if (l.isPrimary) primaryCount += 1;

    if (!url) {
      map[l.id] = "URL 必填";
      return;
    }
    if (!/^https?:\/\/.+/i.test(url)) {
      map[l.id] = "URL 需以 http:// 或 https:// 開頭";
      return;
    }
    if (!title && l.type !== "support") {
      map[l.id] = "建議填寫標題（可快速辨識）";
      return;
    }
  });

  if (primaryCount > 1) {
    const firstPrimary = form.links.find((x) => x.isPrimary);
    if (firstPrimary) map[firstPrimary.id] = "主要連結最多 1 個（請取消多餘的主要勾選）";
  }

  Object.keys(linkErrors).forEach((k) => delete linkErrors[k]);
  Object.keys(map).forEach((k) => (linkErrors[k] = map[k]));

  return Object.keys(map).length === 0;
}

const districtOptions = computed(() => {
  const city = form.address.city;
  const list = cityDistrictMap[city] || [];
  return list.map((x) => ({ label: x, value: x }));
});

function onCityChanged() {
  const list = cityDistrictMap[form.address.city] || [];
  if (!list.includes(form.address.district)) form.address.district = list[0] || "";
}

function generateMapUrl() {
  const parts = [form.address.city, form.address.district, form.address.detail]
    .map((x) => String(x || "").trim())
    .filter(Boolean);

  const query = parts.join("");
  if (!query) {
    showBanner("error", "產生失敗", "請至少填寫縣市/區域/地址其中一項");
    return;
  }

  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
  form.address.mapUrl = url;
  showBanner("success", "已產生地圖連結", "可直接點右側預覽開啟");
}

function clearAddress() {
  form.address.city = "桃園市";
  form.address.district = "中壢區";
  form.address.detail = "";
  form.address.note = "";
  form.address.mapUrl = "";
}

function clearErrors() {
  errors.title = "";
  errors.summary = "";
  errors.category = "";
  errors.publishAt = "";
  errors.cover = "";
}

function validateForm() {
  clearErrors();

  if (!String(form.title || "").trim()) errors.title = "標題必填";
  if (!String(form.summary || "").trim()) errors.summary = "摘要必填";
  if (!form.category) errors.category = "分類必填";
  if (!(form.publishAt instanceof Date) || isNaN(form.publishAt.getTime()))
    errors.publishAt = "上架時間必填";

  const hasCover = !!preview.value.coverPreviewUrl;
  if (!hasCover) errors.cover = "建議設定封面圖（可上傳或填入 URL）";

  const linkOk = validateLinks();

  const ok =
    !errors.title && !errors.summary && !errors.category && !errors.publishAt && linkOk;
  return ok;
}

function buildSubmitPayload() {
  return {
    title: String(form.title || "").trim(),
    summary: String(form.summary || "").trim(),
    category: form.category,
    status: form.status,
    priority: form.priority,
    tags: [...(form.tags || []), ...(form.customTags || [])].filter(Boolean),
    publishAt: form.publishAt ? form.publishAt.toISOString() : null,
    unpublishAt: form.unpublishAt ? form.unpublishAt.toISOString() : null,
    sortWeight: Number(form.sortWeight || 0),
    flags: { ...form.flags },
    media: {
      cover: coverState.file
        ? { type: "file", name: coverState.file.name }
        : form.coverUrl
        ? { type: "url", url: form.coverUrl }
        : null,
      gallery: galleryState.items.map((x) => ({ type: "file", name: x.file?.name })),
      video: videoState.file
        ? { type: "file", name: videoState.file.name }
        : form.videoUrl
        ? { type: "url", url: form.videoUrl }
        : null,
    },
    contentHtml: String(form.content || ""),
    links: form.links.map((x) => ({
      title: String(x.title || "").trim(),
      url: String(x.url || "").trim(),
      type: x.type,
      isPrimary: !!x.isPrimary,
      openInNewTab: !!x.openInNewTab,
    })),
    address: { ...form.address },
    seo: {
      metaTitle: String(form.seo.metaTitle || "").trim(),
      metaDescription: String(form.seo.metaDescription || "").trim(),
      useCoverAsOg: !!form.seo.useCoverAsOg,
      ogImageUrl: String(form.seo.ogImageUrl || "").trim(),
    },
  };
}

function saveDraft() {
  const ok = validateForm();
  const payload = buildSubmitPayload();
  if (!ok) {
    showBanner("error", "草稿儲存失敗", "請先修正紅字錯誤（示範用驗證）");
    return;
  }
  showBanner(
    "success",
    "草稿已儲存（示範）",
    `已整理 payload（未送出 API），標題：${payload.title}`
  );
}

function publish() {
  const ok = validateForm();
  const payload = buildSubmitPayload();
  if (!ok) {
    showBanner("error", "發布失敗", "請先修正紅字錯誤（示範用驗證）");
    return;
  }
  form.status = "published";
  showBanner(
    "success",
    "發布成功（示範）",
    `已整理 payload（未送出 API），標題：${payload.title}`
  );
}

function resetForm() {
  clearErrors();

  form.title = "";
  form.summary = "";
  form.category = null;
  form.status = "draft";
  form.priority = "normal";
  form.tags = [];
  form.customTags = [];
  form.publishAt = nowPlusMinutes(30);
  form.unpublishAt = null;
  form.sortWeight = 0;
  form.flags.isPinned = false;
  form.flags.isFeatured = false;
  form.flags.allowComments = true;
  form.flags.isMembersOnly = false;

  form.coverUrl = "";
  form.videoUrl = "";
  form.content = "";

  form.links = [
    {
      id: uid("link"),
      title: "活動規則",
      url: "https://example.com/rules",
      type: "rules",
      isPrimary: true,
      openInNewTab: true,
    },
  ];

  clearAddress();

  form.seo.metaTitle = "";
  form.seo.metaDescription = "";
  form.seo.useCoverAsOg = true;
  form.seo.ogImageUrl = "";

  removeCover();
  clearGallery();
  removeVideo();

  attachments.items = [];
  Object.keys(linkErrors).forEach((k) => delete linkErrors[k]);

  syncEditorFromFormContent();
  showBanner("info", "已重置", "表單已回到初始狀態");
}

function fillExample() {
  form.title = "2026 新年限定活動｜會員專屬折扣";
  form.summary = "新年限定優惠開跑！指定品項最高 7 折，會員再享額外折扣。";
  form.category = "event";
  form.status = "scheduled";
  form.priority = "high";
  form.tags = ["新年", "折扣", "會員"];
  form.customTags = ["早鳥", "限定"];
  form.publishAt = nowPlusMinutes(120);
  form.unpublishAt = nowPlusMinutes(60 * 24 * 10);
  form.sortWeight = 50;

  form.flags.isPinned = true;
  form.flags.isFeatured = true;
  form.flags.allowComments = true;
  form.flags.isMembersOnly = true;

  form.content = `
    <p>活動期間：<strong>1/1～1/10</strong></p>
    <ul>
      <li>指定品項最高 7 折</li>
      <li>會員再享額外折扣</li>
      <li>數量有限，售完為止</li>
    </ul>
    <p>注意事項：</p>
    <ol>
      <li>每位會員限購 2 件</li>
      <li>不可與其他優惠併用</li>
    </ol>
    <p>更多資訊可參考外部連結。</p>
  `.trim();

  form.links = [
    {
      id: uid("link"),
      title: "活動規則",
      url: "https://example.com/rules",
      type: "rules",
      isPrimary: true,
      openInNewTab: true,
    },
    {
      id: uid("link"),
      title: "立即報名",
      url: "https://example.com/register",
      type: "register",
      isPrimary: false,
      openInNewTab: true,
    },
  ];

  form.address.city = "桃園市";
  form.address.district = "中壢區";
  form.address.detail = "中正路 100 號";
  form.address.note = "入口在巷內";
  generateMapUrl();

  form.seo.metaTitle = "2026 新年限定活動｜會員專屬折扣";
  form.seo.metaDescription = "新年限定優惠開跑！指定品項最高 7 折，會員再享額外折扣。";
  form.seo.useCoverAsOg = true;
  form.seo.ogImageUrl = "";

  syncEditorFromFormContent();
  showBanner("success", "已套用範例", "你可以直接調整內容再按發布（示範）");
}

function formatDateTime(d) {
  if (!(d instanceof Date) || isNaN(d.getTime())) return "—";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}`;
}

const preview = computed(() => {
  const title = String(form.title || "").trim() || "（未填寫標題）";
  const summary = String(form.summary || "").trim() || "（未填寫摘要）";
  const category =
    categoryOptions.find((x) => x.value === form.category)?.label || "未分類";

  const tags = [...(form.tags || []), ...(form.customTags || [])]
    .map((x) => String(x || "").trim())
    .filter(Boolean);
  const uniqTags = Array.from(new Set(tags));

  const publishText = `上架：${formatDateTime(form.publishAt)}`;

  const statusLabel =
    statusOptions.find((x) => x.value === form.status)?.label || form.status;
  const statusSeverity =
    form.status === "published"
      ? "success"
      : form.status === "scheduled"
      ? "info"
      : form.status === "unpublished"
      ? "warning"
      : "secondary";

  const coverPreviewUrl = coverState.objectUrl
    ? coverState.objectUrl
    : String(form.coverUrl || "").trim()
    ? String(form.coverUrl || "").trim()
    : "";

  const galleryPreviewUrls = galleryState.items.map((x) => x.objectUrl).filter(Boolean);

  const videoPreviewUrl = videoState.objectUrl
    ? videoState.objectUrl
    : String(form.videoUrl || "").trim()
    ? String(form.videoUrl || "").trim()
    : "";
  const videoIsFile = !!videoState.objectUrl;

  const links = (form.links || [])
    .map((x) => ({
      id: x.id,
      title: String(x.title || "").trim(),
      url: String(x.url || "").trim(),
      type: x.type,
      isPrimary: !!x.isPrimary,
      openInNewTab: !!x.openInNewTab,
    }))
    .filter((x) => !!x.url);

  const addressParts = [form.address.city, form.address.district, form.address.detail]
    .map((x) => String(x || "").trim())
    .filter(Boolean);
  const addressText = addressParts.length ? addressParts.join("") : "（未填寫地址）";
  const mapUrl = String(form.address.mapUrl || "").trim();

  const seoTitle = String(form.seo.metaTitle || "").trim() || title;
  const seoDescription = String(form.seo.metaDescription || "").trim() || summary;

  const ogUrl = String(form.seo.ogImageUrl || "").trim();
  const ogImageUrl = form.seo.useCoverAsOg ? coverPreviewUrl || ogUrl : ogUrl;
  const ogImageText = ogImageUrl ? ogImageUrl : "（無）";

  const contentHtml = String(form.content || "").trim()
    ? String(form.content || "").trim()
    : `<p class="text-slate-500">（未填寫內容）</p>`;

  return {
    title,
    summary,
    contentHtml,
    categoryText: category,
    tagsText: uniqTags,
    publishText,
    statusText: statusLabel,
    statusSeverity,
    isPinned: !!form.flags.isPinned,
    isFeatured: !!form.flags.isFeatured,
    isMembersOnly: !!form.flags.isMembersOnly,
    coverPreviewUrl,
    galleryPreviewUrls,
    videoPreviewUrl,
    videoIsFile,
    links,
    addressText,
    mapUrl,
    seoTitle,
    seoDescription,
    ogImageText,
  };
});

const previewBadgeText = computed(() => {
  const s = form.status;
  return statusOptions.find((x) => x.value === s)?.label || s;
});

watch(
  () => [form.address.city, form.address.district, form.address.detail],
  () => {
    const hasAny =
      String(form.address.city || "").trim() ||
      String(form.address.district || "").trim() ||
      String(form.address.detail || "").trim();
    if (!hasAny) return;

    const parts = [form.address.city, form.address.district, form.address.detail]
      .map((x) => String(x || "").trim())
      .filter(Boolean);
    if (!parts.length) return;

    const query = parts.join("");
    form.address.mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query
    )}`;
  }
);

onBeforeUnmount(() => {
  try {
    editorRef.value?.destroy();
  } catch (e) {}

  safeRevoke(coverState.objectUrl);
  galleryState.items.forEach((x) => safeRevoke(x.objectUrl));
  safeRevoke(videoState.objectUrl);
});
</script>

<style scoped>
:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-multiselect),
:deep(.p-calendar),
:deep(.p-inputnumber),
:deep(.p-chips),
:deep(.p-textarea) {
  width: 100%;
}

:deep(.tiptap-editor .ProseMirror) {
  min-height: 160px;
  outline: none;
}

:deep(.tiptap-editor .ProseMirror p) {
  margin: 0.5rem 0;
}

:deep(.tiptap-editor .ProseMirror ul),
:deep(.tiptap-editor .ProseMirror ol) {
  padding-left: 1.25rem;
  margin: 0.5rem 0;
}

:deep(.tiptap-editor .ProseMirror blockquote) {
  border-left: 4px solid #e2e8f0;
  padding-left: 0.75rem;
  color: #475569;
}

:deep(.tiptap-editor .ProseMirror a) {
  color: #4338ca;
  text-decoration: underline;
}

:deep(.tiptap-editor .ProseMirror img) {
  max-width: 100%;
  border-radius: 0.75rem;
  display: block;
  margin: 0.5rem 0;
}

:deep(.tiptap-preview p) {
  margin: 0.5rem 0;
}

:deep(.tiptap-preview ul),
:deep(.tiptap-preview ol) {
  padding-left: 1.25rem;
  margin: 0.5rem 0;
}

:deep(.tiptap-preview a) {
  color: #4338ca;
  text-decoration: underline;
}

:deep(.tiptap-preview img) {
  max-width: 100%;
  border-radius: 0.75rem;
  display: block;
  margin: 0.5rem 0;
}
</style>
