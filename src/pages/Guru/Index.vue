<template>
  <!-- drawer kiri -->
  <div>
    <!-- skeleton -->
    <div class="row flex flex-center" v-if="loading">
      <q-card
        flat
        style="max-width: 300px; min-heigth:300px"
        class="my-card q-ma-sm col-2"
        v-for="n in 5"
        :key="n"
      >
        <q-item style="max-width: 300px">
          <q-item-section avatar>
            <q-skeleton type="QAvatar" />
          </q-item-section>

          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" />
            </q-item-label>
            <q-item-label caption>
              <q-skeleton type="text" width="65%" />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
    </div>
    <!-- end skeleton -->
    <div class=""></div>
    <div class="row flex flex-center" v-if="!loading">
      <q-card
        class="my-card col-xl-3 col-sm-12 col-md-6 q-ma-sm"
        style="max-width: 300px"
        v-for="guru in gurus"
        :key="guru.id"
      >
        <q-item @click="redirectProfile(guru.id)" clickable v-ripple>
          <q-item-section avatar>
            <q-avatar>
              <q-img v-if="guru.foto" :src="guru.foto" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ guru.nama }}</q-item-label>
            <q-item-label caption>
              {{ guru.lulusan }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
    </div>
    <div class="flex flex-center">
      <div class="q-ma-sm flex flex-center">
        <q-btn
          round
          color="primary"
          icon="arrow_left"
          v-if="pages.prev_page_url"
          @click="handleApi(pages.prev_page_url)"
        />
        <q-btn class="q-ma-sm" round color="primary" :label="pages.last_page" />
        to
        <q-btn class="q-ma-sm" round color="primary" :label="pages.to" />
        <q-btn
          class="q-ma-sm"
          round
          color="primary"
          icon="arrow_right"
          v-if="pages.next_page_url"
          @click="handleApi(pages.next_page_url)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Guru from 'models/Guru';
import { copyToClipboard } from "quasar";
export default {
  name: "GuruComponent",
  data() {
    return {
      loading: true,
      //gurus: {},
      pages: {}
    };
  },
  methods: {
    redirectProfile(id) {
      return this.$router.push(`/guru/id/${id}`);
    },
    copy(text) {
      copyToClipboard(text)
        .then(() => {
          this.$q.notify({
            message: "Nama Tercopy",
            color: "purple"
          });
        })
        .catch(() => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    },
    async handleApi(url) {
      await this.$axios
        .get(url)
        .then(response => {
          this.pages = response.data;
          //this.gurus = response.data.data;
          Guru.insert({
            data : response.data.data
          })
        })
        .catch(() => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    },
    async loadData() {
      // await this.$axios
      //   .get(`${process.env.API_URL}/api/v1/guru`)
      //   .then(response => {
      //     this.pages = response.data;
      //     //this.gurus = response.data.data;
      //     Guru.insert({
      //       data : response.data.data
      //     })
      //   })
      //   .catch(() => {
      //     this.$q.notify({
      //       type: "negative",
      //       message: error.response.data.pesan
      //     });
      //   });
    }
  },
  async mounted() {
    const gurus = Guru.exists()
    if(!gurus){
    await this.loadData();
    this.loading = false;
    }
  },

  computed:{
    gurus(){
      return Guru.all()
    }
  }
};
</script>

<style lang="sass" src="./Index.sass" scoped></style>