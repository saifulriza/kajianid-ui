<template>
  <q-page>
    <div class="row q-ma-sm flex flex-center">
      <q-card
        class="my-card q-ma-sm col-sm-3 col-md-4 col-xl-4 "
        flat
        bordered
        v-for="masjid in masjids"
        :key="masjid.id"
        @click="redirectProfile(masjid.id)"
        style="cursor:pointer"
      >
        <q-card-section horizontal align="center">
          <q-card-section class="q-pt-xs full-width">
            <div class="text-overline">
              {{ masjid.alamat !== null ? masjid.alamat.nama : "Belum ada" }}
            </div>
            <div class="text-h5 q-mt-sm q-mb-xs">{{ masjid.nama }}</div>
            <div class="text-caption text-grey">
              {{ masjid.profil.substring(0, 100) + ".." }}
            </div>
          </q-card-section>

          <!-- <q-card-section
            v-if="typeof masjid.foto[0] !== 'undefined'"
            class="col-5 flex flex-center"
            style="max-widht:100px; max-height:100px"
          >
          </q-card-section> -->
        </q-card-section>

        <q-separator />

        <q-card-section align="center">
          <q-btn flat icon="event" color="primary">
            {{ masjid.kajian.length }} Kajian
          </q-btn>
          <!-- <q-btn flat icon="star" color="orange">
            {{ masjid.review.length }} Review
          </q-btn> -->
        </q-card-section>
      </q-card>
    </div>
    <div class="row flex flex-center">
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
  </q-page>
</template>
<script>
import Masjid from "models/Masjid";
export default {
  name: "MasjidIndex",
  data() {
    return {
      masjidAll: {},
      pages: {},
      loading: true
    };
  },
  methods: {
    async handleApi(url) {
      await this.$axios
        .get(url)
        .then(response => {
          this.pages = response.data;
          this.masjids = response.data.data;
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    },
    redirectProfile(id) {
      return this.$router.push(`/masjid/id/${id}`);
    },
    async loadData() {
      await this.$axios
        .get(`${process.env.API_URL}/api/v1/masjid`)
        .then(response => {
          this.pages = response.data;
          this.masjidAll = response.data.data;
          Masjid.insert({
            data: this.masjidAll
          });
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    }
  },

  async mounted() {
    const masjid = Masjid.query().count();
    if (masjid < 2) await this.loadData();
    this.loading = false;
  },

  computed: {
    masjids() {
      return Masjid.all();
    }
  }
};
</script>
<style lang="sass" src="./Index.sass"></style>
