<template>
  <q-page class="q-pa-md">
    <div v-if="typeof datas.kajian !== 'undefined'">
      <div
        class="flex flex-center"
        v-if="datas.kajian && datas.kajian.total == 0"
      >
        <div class="flex flex-center">
          <q-card class="q-ma-sm bg-primary text-white">
            <div class="q-ma-sm flex flex-center">
              Pencarian tidak ditemukan <br />
            </div>
          </q-card>
        </div>
      </div>
    </div>
    <div v-if="typeof datas.kajian == 'undefined'">
      <div
        class="flex flex-center"
        v-if="datas.masjid && datas.masjid.total == 0"
      >
        <div class="flex flex-center">
          <q-card class="q-ma-sm bg-primary text-white">
            <div class="q-ma-sm flex flex-center">
              Pencarian tidak ditemukan <br />
            </div>
          </q-card>
        </div>
      </div>
    </div>

    <div v-if="datas.masjid || datas.kajian">
      <!-- pencarian by masjid/tempat -->
      <div v-if="typeof datas.masjid !== 'undefined'">
        <div class="row flex flex-center">
          <div class="col-4" v-for="data in datas.masjid.data" :key="data.id">
            <q-card class="my-card q-ma-sm bg-primary text-white">
              <q-card-section>
                <div class="text-h6">
                  {{ data.jenis }} {{ data.nama }}, {{ data.alamat.nama }}
                </div>
                <ul>
                  <div
                    class="text-subtitle2"
                    v-for="kajian in data.kajian"
                    :key="kajian.id"
                  >
                    <li style="cursor:pointer" @click="redirect(kajian.id)">
                      <b>{{ kajian.bahasan }}</b>
                    </li>
                    <div class="">
                      <i> Oleh ustadz {{ kajian.guru.nama }} </i>
                    </div>
                    <div>
                      Hari {{ kajian.hari }} Jam {{ kajian.jam_mulai }} -
                      {{ kajian.jam_selesai }}
                    </div>
                    <br />
                  </div>
                </ul>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <!-- end by tempat -->

      <!-- pencarian by kajian/bahasan -->
      <div v-if="typeof datas.kajian !== 'undefined'">
        <div class="row flex flex-center">
          <div class="col-4" v-for="data in datas.kajian.data" :key="data.id">
            <q-card class="my-card q-ma-sm bg-primary text-white">
              <q-card-section>
                <div class="text-h6">
                  {{ data.masjid.jenis }} {{ data.masjid.nama }},
                  {{ data.masjid.alamat.nama }}
                </div>
                <ul>
                  <div class="text-subtitle2">
                    <li style="cursor:pointer" @click="redirect(data.id)">
                      <b>{{ data.bahasan }}</b>
                    </li>
                    <div class="">
                      <i> Oleh ustadz {{ data.guru.nama }} </i>
                    </div>
                    <div>
                      Hari {{ data.hari }} Jam {{ data.jam_mulai }} -
                      {{ data.jam_selesai }}
                    </div>
                    <br />
                  </div>
                </ul>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <!-- end by bahasan -->
    </div>
    <!-- pagination by bahasan -->
    <div
      class="q-ma-sm flex flex-center"
      v-if="typeof datas.kajian !== 'undefined' && datas.kajian.total !== 0"
    >
      <q-btn
        round
        color="primary"
        icon="arrow_left"
        v-if="datas.kajian.prev_page_url"
        @click="handleApi(datas.kajian.prev_page_url)"
      />
      <q-btn
        class="q-ma-sm"
        round
        color="primary"
        :label="datas.kajian.last_page"
      />
      to
      <q-btn class="q-ma-sm" round color="primary" :label="datas.kajian.to" />
      <q-btn
        class="q-ma-sm"
        round
        color="primary"
        icon="arrow_right"
        v-if="datas.kajian.next_page_url"
        @click="handleApi(datas.kajian.next_page_url)"
      />
    </div>
    <!-- end by bahasan -->

    <!-- pagination by alamat -->
    <div
      class="q-ma-sm flex flex-center"
      v-if="typeof datas.masjid !== 'undefined' && datas.masjid.total !== 0"
    >
      <q-btn
        round
        color="primary"
        icon="arrow_left"
        v-if="datas.masjid.prev_page_url"
        @click="handleApi(datas.masjid.prev_page_url)"
      />
      <q-btn
        class="q-ma-sm"
        round
        color="primary"
        :label="datas.masjid.last_page"
      />
      to
      <q-btn class="q-ma-sm" round color="primary" :label="datas.masjid.to" />
      <q-btn
        class="q-ma-sm"
        round
        color="primary"
        icon="arrow_right"
        v-if="datas.masjid.next_page_url"
        @click="handleApi(datas.masjid.next_page_url)"
      />
    </div>
    <!-- end by alamat -->
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      datas: {}
    };
  },
  methods: {
    redirect(id) {
      return this.$router.replace(`/kajian/id/${id}`);
    },
    async handleApi(url) {
      await this.$axios
        .get(url)
        .then(response => {
          this.datas = response.data;
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
          `${process.env.API_URL}/api/v1/kajian/alamat/${this.$route.params.id}`
        )
        .then(response => {
          this.datas = response.data;
        })
        .catch(error => {
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
