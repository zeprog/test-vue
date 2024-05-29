<template>
  <div class="main-layout">
    <div class="content-section"><h2 class="content-section__title">Формирование финального PDF документа</h2></div>
    <div class="content-section"><p class="task-desc"><strong>На данной странице вы можете продумать структуру и создать
      PDF-документ, который участники получат после прохождения курса.</strong></p>
      <span class="label">Впишите текст приветствия</span>
      <quill-editor :options="options" v-model="greetings"/>
    </div>
    <div class="content-section">
      <div class="make-task-list">
        <div class="make-task-list__item" v-for="(item, index) in settings.idsAndDesc" :key="index">
          <div class="make-task-list__main">
            <div class="make-task-list__top">
              <div>
                <div class="input-wrapper"><span class="label">Выберите задание</span>
                  <label class="select-standart">
                    <select v-model="item.id" @change="setQuiz(index)">
                      <option v-for="a in assignments" :value="a.id">{{ a.name }}</option>
                    </select>
                  </label>
                </div>
              </div>
              <div>
                <div class="input-number-wrap">
                  <label class="input-wrapper"><span class="label">Порядковый номер</span>
                    <input type="number" :value="index + 1" @input.number="item.sort = $event.target.value" @focus="$event.target.value = null">
                  </label>
                </div>
              </div>
            </div>
            <span class="label">Впишите текст, который будет идти перед заданием</span>
            <quill-editor :options="optionsTask" v-model="item.desc"/>
            <div class="questions"
                 v-if="item.questions"
                 v-for="question in item.questions"
                 :class="{disabled: question.disabled}"
            >
              <label>
                <input type="checkbox"
                       v-model="question.disabled"
                       :true-value="undefined"
                       :false-value="true"
                       @change="$event.target.checked ? $event.target.parentElement.parentElement.classList.remove('disabled') : $event.target.parentElement.parentElement.classList.add('disabled')"
                />
                <span class="label">{{ question.name }}:</span>
              </label>
              <quill-editor :options="optionsTask" v-model="question.text"/>
            </div>
          </div>
          <div class="make-task-list__aside" v-if="settings.idsAndDesc.length > 1">
            <div class="round-button round-button_remove" @click.prevent="settings.idsAndDesc.splice(index, 1)">
              <div>Close</div>
            </div>
          </div>
        </div>
      </div>
      <div class="add-task" @click="add">
        <div class="round-button round-button_add">
          <div>Add</div>
        </div>
        <span>Добавить задание</span>
      </div>
    </div>
    <div class="content-section template-edit-wrapper" :class="{opened: openEdit}">
      <a class="task-desc template-edit-button" @click.prevent="openEdit = !openEdit">Редактирование шаблона PDF</a>
      <div class="template-edit">
        <p class="template-edit-desc">Обложка (.journal-cover)</p>
        <prism-editor class="template-edit-editor" v-model="cover" :highlight="highlighter(cover)"/>
        <p class="template-edit-desc">Страница задания (.journal-page)</p>
        <prism-editor class="template-edit-editor" v-model="page" :highlight="highlighter(page)"/>
        <p class="template-edit-desc">Заключение (.journal-back)</p>
        <prism-editor class="template-edit-editor" v-model="back" :highlight="highlighter(back)"/>
        <p class="template-edit-desc">Стили</p>
        <prism-editor class="template-edit-editor" v-model="styles" :highlight="highlighter(styles, true)"/>
        <br/>
        <button @click="preview" class="button">Превью</button>
      </div>
    </div>
    <div class="content-section final-buttons">
      <button @click="save" class="button" :class="{saved: saved}">{{ saved ? 'Сохранено' : 'Сохранить'}}</button>
    </div>
  </div>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism.css';
import templates from '@/assets/templates.json';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor'



export default {
  name: 'JournalAdmin',
  data() {
    return {
      saved: false,
      openEdit: false,
      options: {
        placeholder: '',
        modules: {
          toolbar: ['bold', 'italic', 'underline', 'strike',{ 'header': 1 }, { 'header': 2 },{ 'color': [] },{ 'background': [] },{ 'align': [] },{ 'list': 'ordered'}, { 'list': 'bullet' },'link', 'image']
        },
      },
      optionsTask: {
        placeholder: '',
        modules: {
          toolbar: ['bold', 'italic', 'underline', 'strike',{ 'header': 1 }, { 'header': 2 },{ 'color': [] },{ 'background': [] },{ 'align': [] },{ 'list': 'ordered'}, { 'list': 'bullet' }]
        },
      },
      console
    }
  },
  components: {
    PrismEditor,
    quillEditor
  },
  methods: {
    highlighter(code, css) {
      return ()=>highlight(code, css ? languages.css : languages.markup, css ? 'css' : 'markup');
    },
    async saveSettings() {
      if (this.settings.idsAndDesc) {
        this.settings.idsAndDesc.map((item, index) => {
          if(!item.hasOwnProperty('sort'))
            item.sort = index + 1;
        });
        this.settings.idsAndDesc.sort((x, y) => x.sort - y.sort);
        for(let i = 0; i < this.settings.idsAndDesc.length; i++) {
          if(!this.settings.idsAndDesc[i].id) {
            this.settings.idsAndDesc.splice(i, 1);
            i--;
          } else {
            delete this.settings.idsAndDesc[i].sort;
          }
        }
      }
      await this.$store.dispatch('updateSettings', this.settings);
    },
    save() {
      this.saved = true;
      this.saveSettings();
      setTimeout(()=>{this.saved = false}, 2000);
    },
    add() {
      if(this.settings.idsAndDesc)
        this.settings.idsAndDesc.push({id: '', desc: ''});
      else
        this.$set(this.settings, 'idsAndDesc', [{id: '', desc: ''}]);
    },
    setQuiz(index) {
      let assignment = this.assignments.find(a => a.id === this.settings.idsAndDesc[index].id);
      let questions = assignment.questions;
      if(this.settings.idsAndDesc[index].id.toString().includes(':')) {
        this.settings.idsAndDesc[index].quiz_id = this.settings.idsAndDesc[index].id.split(':')[0];
        this.settings.idsAndDesc[index].quiz_question_id = this.settings.idsAndDesc[index].id.split(':')[1];
        delete this.settings.idsAndDesc[index].questions;
      } else if(questions){
        this.settings.idsAndDesc[index].questions = questions;
        delete this.settings.idsAndDesc[index].quiz_id;
        delete this.settings.idsAndDesc[index].quiz_question_id;
      } else {
        delete this.settings.idsAndDesc[index].quiz_id;
        delete this.settings.idsAndDesc[index].quiz_question_id;
        delete this.settings.idsAndDesc[index].questions;
      }
    },
    preview() {
      let preview = templates.preview;
      if(this.cover.includes('journal-layout'))
        preview = preview.replace('journal-layout journal-cover', '');
      if(this.back.includes('journal-layout'))
        preview = preview.replace('journal-layout journal-back', '');
      let html = preview
          .replace('{{cover}}', this.cover)
          .replace('{{page}}', this.page)
          .replace('{{back}}', this.back)
          .replace('{{description}}', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.')
          .replace('{{styles}}', this.styles);
      let previewWindow = window.open();
      previewWindow.document.body.innerHTML = html;
      previewWindow.document.querySelectorAll('.journal-layout').forEach((e)=>{
        let wrapper = document.createElement('div');
        wrapper.className = 'page-preview';
        wrapper.appendChild(e.cloneNode(true));
        e.parentNode.replaceChild(wrapper, e);
      });
      previewWindow.document.title = 'Preview';
    }
  },
  computed: {
    assignments() {
      return this.$store.state.assignments;
    },
    settings() {
      return this.$store.state.settings;
    },
    cover: {
      set(v) {
        this.$set(this.settings, 'cover', v);
      },
      get() {
        return this.settings.cover ? this.settings.cover : templates.cover;
      }
    },
    page: {
      set(v) {
        this.$set(this.settings, 'page', v);
      },
      get() {
        return this.settings.page ? this.settings.page : templates.page;
      }
    },
    back: {
      set(v) {
        this.$set(this.settings, 'back', v);
      },
      get() {
        return this.settings.back ? this.settings.back : templates.back;
      }
    },
    styles: {
      set(v) {
        this.$set(this.settings, 'styles', v);
      },
      get() {
        return this.settings.styles ? this.settings.styles : templates.styles;
      }
    },
    greetings: {
      set(v) {
        this.$set(this.settings, 'greetings', v);
      },
      get() {
        return this.settings.greetings ? this.settings.greetings : templates.greetings;
      }
    },
  },
}
</script>

<style>
  @import "../assets/insert-table-formation-pdf.css";
</style>

<style lang="sass">
  .ql-container.ql-snow
    min-height: 220px
    border: 1px solid #ADA0A2

  .questions
    margin-top: 30px
    user-select: none

    &.disabled .ql-container.ql-snow,
    &.disabled .ql-toolbar.ql-snow
      background: #f7f7f7
      color: #999
      pointer-events: none

    .ql-container.ql-snow
      min-height: auto

  .ql-editor
    font-size: 16px
    font-family: 'Raleway', sans-serif

  .ql-toolbar.ql-snow
    border: 1px solid #ADA0A2

  .template-edit-wrapper
    margin: -50px 0 40px

    .template-edit-desc
      padding: 10px 0 5px

    .template-edit-editor
      max-height: 200px
      border: 1px solid #ADA0A2
      font-size: 14px

      .prism-editor__container
        min-height: 198px

      .prism-editor__textarea
        outline: none
        min-height: 200px

    .template-edit
      height: 0
      opacity: 0
      overflow: auto
      transition: .2s linear

    &.opened .template-edit
      height: 1050px
      opacity: 1

    .template-edit-button
      cursor: pointer

      &::before
        content: '\203A'
        display: inline-block
        font-size: 35px
        color: #C54D4D
        padding: 5px
        vertical-align: sub
        transform-origin: 50% 53%
        transition: .2s

    &.opened .template-edit-button::before
        transform: rotate(90deg)

  .select-standart::after
    pointer-events: none

  .button
    min-width: 200px
    outline: none
    &.saved
      opacity: .6
      pointer-events: none
</style>