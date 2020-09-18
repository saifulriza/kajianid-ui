<template>
  <q-page class="q-pa-md">
    <div v-if="typeof datas == 'undefined'">
      <div class="flex flex-center">
        <q-card class="q-ma-sm bg-primary text-white">
          <div class="q-ma-sm flex flex-center">
            Masjid tidak ditemukan <br />
          </div>
        </q-card>
      </div>
    </div>
    <div v-if="datas">
      <!-- pencarian by masjid/tempat -->
      <div v-if="typeof datas !== 'undefined'">
        <div class="row flex flex-center">
          <div
            class="col-4"
            style="cursor:pointer"
            v-for="data in datas"
            :key="data.id"
            @click="redirectProfile(data.id)"
          >
            <q-card class="my-card q-ma-sm bg-primary text-white">
              <q-card-section>
                <div class="text-h6">{{ data.jenis }} {{ data.nama }}</div>
              </q-card-section>
              <q-card-section>
                <div class="text-subtitle2">
                  <q>{{ data.profil }}</q>
                </div>
              </q-card-section>
              <q-card-section>
                <div class="text-subtitle2">
                  Memiliki : {{ data.kajian.length }} Kajian
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <!-- end by tempat -->
    </div>
    <!-- pagination by alamat -->
    <div class="q-ma-sm flex flex-center" v-if="typeof datas !== 'undefined'">
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
    <!-- end by alamat -->
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      datas: {},
      pages: {}
    };
  },
  methods: {
    redirectProfile(id) {
      return this.$router.push(`/masjid/id/${id}`);
    },
    redirect(id) {
      return this.$router.replace(`/kajian/id/${id}`);
    },
    async handleApi(url) {
      await this.$axios
        .get(url)
        .then(response => {
          this.datas = response.data.data;
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    },
    async loadData() {
      await this.$axios
        .get(
          `${process.env.API_URL}/api/v1/masjid/nama/${this.$route.params.id}`
        )
        .then(response => {
          this.pages = response.data;
          this.datas = response.data.data;
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
    this.loadData();
  }
};
</script>
