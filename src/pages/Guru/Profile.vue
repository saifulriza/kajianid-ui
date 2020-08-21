<template>
  <q-page class="flex flex-center">
    <!-- skeleton -->
    <div class="row flex flex-center" v-if="loading">
      <q-card flat style="width: 300px">
        <q-skeleton height="150px" square />

        <q-card-section>
          <q-skeleton type="text" class="text-subtitle1" />
          <q-skeleton type="text" width="50%" class="text-subtitle1" />
          <q-skeleton type="text" class="text-caption" />
        </q-card-section>
      </q-card>
    </div>
    <!-- end skeleton -->
    <div v-if="!loading">
      <div v-if="Object.keys(data).length == 0">
        <div class="flex flex-center">
          <q-card class="q-ma-sm bg-primary text-white">
            <div class="q-ma-sm flex flex-center">
              Ustadz tidak ditemukan <br />
            </div>
          </q-card>
        </div>
      </div>
      <q-card
        class="my-card q-ma-md flex flex-center"
        v-if="Object.keys(data).length !== 0"
      >
        <q-card-section>
          <q-img
            :src="data.foto"
            class="rounded-borders"
            style="max-width:300px; min-width:250px; max-height:300px; min-height:250px"
          >
            <div class="absolute-bottom text-subtitle1 text-center">
              {{ data.nama }}
            </div>
          </q-img>
          <q-card-actions align="center">
            {{ data.tempat_lahir }},
            {{ moment(data.tgl_lahir).format("DD/MM/YYYY") }}
          </q-card-actions>
          <q-card-actions align="center">
            <q-btn
              outline
              rounded
              flat
              color="primary"
              icon="fab fa-facebook"
              @click="copy(data.fb)"
            >
              <q-tooltip
                content-class="bg-amber text-black shadow-4"
                :offset="[10, 10]"
              >
                {{ data.fb }}
              </q-tooltip>
            </q-btn>
            <q-btn
              outline
              rounded
              flat
              color="primary"
              icon="fab fa-twitter"
              @click="copy(data.twitter)"
            >
              <q-tooltip
                content-class="bg-amber text-black shadow-4"
                :offset="[10, 10]"
              >
                {{ data.twitter }}
              </q-tooltip>
            </q-btn>
            <q-btn
              outline
              rounded
              flat
              color="red"
              icon="fab fa-instagram"
              @click="copy(data.instagram)"
            >
              <q-tooltip
                content-class="bg-amber text-black shadow-4"
                :offset="[10, 10]"
              >
                {{ data.instagram }}
              </q-tooltip>
            </q-btn>
            <q-btn
              outline
              rounded
              flat
              color="red"
              icon="fab fa-youtube"
              @click="copy(data.youtube)"
            >
              <q-tooltip
                content-class="bg-amber text-black shadow-4"
                :offset="[10, 10]"
              >
                {{ data.youtube }}
              </q-tooltip>
            </q-btn>
          </q-card-actions>

          <!-- 
              <div class="col-6">
             <q> {{data.profile}}.</q>
              </div> -->
          <br />
        </q-card-section>
      </q-card>
      <div class="row flex flex-center">
        <div class="col-12 text-h5 flex flex-center">
          Jadwal Kajian Rutin
        </div>
        <div class="col-12 q-pa-md">
          <q-table
            :data="row"
            :columns="columns"
            color="primary"
            row-key="name"
            :loading="loading"
            @row-click="onRowClick"
          >
            <template v-slot:loading>
              <q-inner-loading showing color="primary" />
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { copyToClipboard } from "quasar";
import moment from "moment";
export default {
  name: "GuruProfile",
  data() {
    return {
      loading: false,
      data: {},
      columns: [
        {
          name: "hari",
          align: "center",
          label: "Hari",
          field: "hari",
          sortable: true
        },
        {
          name: "jam",
          label: "Jam",
          field: row =>
            row.jam_mulai.slice(0, -3) + " - " + row.jam_selesai.slice(0, -3),
          sortable: true
        },
        { name: "bahasan", label: "Bahasan", field: "bahasan" },
        {
          name: "tempat",
          label: "Tempat",
          field: row => row.masjid.alamat.nama
        }
      ],
      row: []
    };
  },
  methods: {
    moment,
    copy(text) {
      copyToClipboard(text)
        .then(() => {
          this.$q.notify({
            message: "Nama Tercopy",
            color: "purple"
          });
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    },
    onRowClick(evt, row) {
      return this.$router.push(`/kajian/id/${row.id}`);
    },
    async loadData() {
      this.loading = true;
      await this.$axios
        .get(`${process.env.API_URL}/api/v1/guru/${this.$route.params.id}`)
        .then(response => {
          this.data = response.data.data;
          this.row = response.data.data.kajian;
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    },
    RedirectBeranda() {
      return this.$router.push("/");
    }
  },

  async created() {
    await this.loadData();
    this.loading = false;
  }
};
</script>
