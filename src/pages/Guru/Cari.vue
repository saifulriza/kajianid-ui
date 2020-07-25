<template>
  <q-page class="q-pa-md">
    <div>
      <!-- skeleton -->
      <div class="row flex flex-center" v-if="loading">
        <q-card
          flat
          style="max-width: 300px"
          class="q-ma-sm col-2"
          v-for="n in 5"
          :key="n"
        >
          <q-skeleton height="150px" square />

          <q-card-section>
            <q-skeleton type="text" class="text-subtitle1" />
            <q-skeleton type="text" width="50%" class="text-subtitle1" />
            <q-skeleton type="text" class="text-caption" />
          </q-card-section>
        </q-card>
      </div>
      <!-- end skeleton -->
      <div class="row flex flex-center" v-if="!loading">
        <div v-if="Object.keys(gurus).length == 0">
          <div class="flex flex-center">
            <q-card class="q-ma-sm bg-primary text-white">
              <div class="q-ma-sm flex flex-center">
                Ustadz tidak ditemukan <br />
              </div>
            </q-card>
          </div>
        </div>
        <q-card
          class="my-card col-2 q-ma-sm"
          v-for="guru in gurus"
          :key="guru.id"
        >
          <q-img v-if="guru.foto" :src="guru.foto">
            <q-item
              @click="redirectProfile(guru.id)"
              class="teks absolute-bottom text-subtitle2 text-center"
              v-ripple
              clickable
              style="white-space: nowrap !important; display:block"
            >
              {{ guru.nama }}
            </q-item>
          </q-img>
          <q-separator />
          <q-card-actions align="center">
            <q-btn
              outline
              rounded
              flat
              color="primary"
              icon="fab fa-facebook"
              @click="copy(guru.fb)"
            >
              <q-tooltip
                content-class="bg-amber text-black shadow-4"
                :offset="[10, 10]"
              >
                {{ guru.fb }}
              </q-tooltip>
            </q-btn>
            <q-btn
              outline
              rounded
              flat
              color="primary"
              icon="fab fa-twitter"
              @click="copy(guru.twitter)"
            >
              <q-tooltip
                content-class="bg-amber text-black shadow-4"
                :offset="[10, 10]"
              >
                {{ guru.twitter }}
              </q-tooltip>
            </q-btn>
            <q-btn
              outline
              rounded
              flat
              color="red"
              icon="fab fa-instagram"
              @click="copy(guru.instagram)"
            >
              <q-tooltip
                content-class="bg-amber text-black shadow-4"
                :offset="[10, 10]"
              >
                {{ guru.instagram }}
              </q-tooltip>
            </q-btn>
            <q-btn
              outline
              rounded
              flat
              color="red"
              icon="fab fa-youtube"
              @click="copy(guru.youtube)"
            >
              <q-tooltip
                content-class="bg-amber text-black shadow-4"
                :offset="[10, 10]"
              >
                {{ guru.youtube }}
              </q-tooltip>
            </q-btn>
          </q-card-actions>
          <q-card-actions>
            <q-btn
              outline
              color="primary"
              align="center"
              no-caps
              class="text-caption "
            >
              <q style="color:black"
                ><i>{{ guru.profile.substring(0, 100) + ".." }}</i></q
              >
            </q-btn>
            <!-- <div class="q-ma-sm text-caption">
            <table>
              <tr>
                <td><b>Tanggal Lahir</b> </td>
                <td>: {{ guru.tgl_lahir }}</td>
              </tr>
              <tr>
                <td><b>Tempat Lahir</b></td>
                <td>: {{guru.tempat_lahir == null ? 'Belum ada' : guru.tempat_lahir}}</td>
              </tr>
              <tr>
                <td><b>Lulusan</b></td>
                <td>: {{guru.lulusan == null ? 'Belum ada' : guru.lulusan }}</td>
              </tr>
              <tr>
                <td><b>Kajian</b></td>
                <td>: {{guru.kajian == null ? 'Belum ada' : guru.kajian.length}}</td>
              </tr>
            </table>
          </div> -->
          </q-card-actions>
        </q-card>
      </div>
      <div class="flex flex-center" v-if="Object.keys(gurus).length !== 0">
        <div class="q-ma-sm flex flex-center">
          <q-btn
            round
            color="primary"
            icon="arrow_left"
            v-if="pages.prev_page_url"
            @click="handleApi(pages.prev_page_url)"
          />
          <q-btn
            class="q-ma-sm"
            round
            color="primary"
            :label="pages.last_page"
          />
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
  </q-page>
</template>

<script>
import { copyToClipboard } from "quasar";
export default {
  data() {
    return {
      loading: true,
      gurus: {},
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
    redirect(id) {
      return this.$router.replace(`/guru/id/${id}`);
    },
    async handleApi(url) {
      this.loading = true;
      await this.$axios
        .get(url)
        .then(response => {
          this.gurus = response.data.data;
          this.loading = false;
        })
        .catch(() => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    },
    async loadData() {
      await this.$axios
        .get(`${process.env.API_URL}/api/v1/guru/nama/${this.$route.params.id}`)
        .then(response => {
          this.pages = response.data;
          this.gurus = response.data.data;
        })
        .catch(() => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    }
  },
  async created() {
    await this.loadData();
    this.loading = false;
  }
};
</script>
<style scoped>
.q-img {
  height: 150px;
}
</style>
