<template>
  <q-page>
    <q-btn
      color="primary"
      class="q-ma-sm"
      @click="modalTambah = true"
      label="Tambah"
    />
    <!-- modal tambah-->
    <q-dialog v-model="modalTambah">
      <q-card class="my-card q-ma-sm q-pa-sm">
        <q-card-section>
          <div class="text-h6">Tambah Data</div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-xl-12">
              <q-file
                filled
                v-model="dataTambah.gambar"
                class="q-ma-sm"
                label="Banner"
              >
                <template v-slot:append>
                  <q-icon name="attach_file" />
                </template>
              </q-file>

              <q-input
                filled
                v-model="dataTambah.selesai"
                class="q-ma-sm"
                mask="date"
                :rules="['date']"
                label="Tgl Selesai"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="dataTambah.selesai"
                        @input="() => $refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                filled
                v-model="dataTambah.link"
                class="q-ma-sm"
                label="Link"
              />
            </div>
          </div>
          <q-btn
            color="primary"
            label="Tambah"
            class="q-ma-sm"
            @click="tambah()"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- end modal tambah -->
    <div class="row q-ma-sm flex flex-center">
      <div
        class="q-pa-sm q-ma-sm col-xl-4 col-md-3 col-sm-12 my-card "
        v-for="flyer in flyers"
        :key="flyer.id"
      >
        <q-card class="my-card q-ma-sm">
          <img :src="flyer.gambar" style="max-width:300px; max-height:250px" />

          <q-card-section>
            <div class="text-subtitle2 text-primary">
              <i class="fa fa-link"> </i> Link :
              {{ flyer.link.substring(0, 30) + ".." }}
            </div>
            <q-separator />
            <div class="text-subtitle2">
              <i class="fa fa-flag"></i>Selesai :
              {{
                moment(flyer.selesai, "YYYYMMDD")
                  .locale("id")
                  .fromNow()
              }}
            </div>
            <q-btn
              color="red"
              class="q-ma-sm"
              @click="hapus(flyer.id)"
              label="Hapus"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      flyers: {},
      modalTambah: false,
      dataTambah: {}
    };
  },
  methods: {
    moment,
    // redirect(link){
    //     return window.location.href = `${link}`
    // },
    hapus(id) {
      let configDelete = {
        headers: {
          //'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
          Authorization: `Bearer ${localStorage.getItem("K0lgfWr")}`
        }
      };
      let form = new FormData();
      form.append("kode_r", this.kode_r);
      form.append("kode_e", this.kode_e);

      this.$axios
        .post(
          `${process.env.API_URL}/api/v1/flyer/${id}?_method=DELETE`,
          form,
          configDelete
        )
        .then(({ data }) => {
          this.$q.notify({
            type: "positive",
            message: data.pesan
          });

          this.loadData();
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
        .get(`${process.env.API_URL}/api/v1/flyer/all`)
        .then(response => {
          this.flyers = response.data.data;
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    },

    tambah() {
      let configTambah = {
        headers: {
          //'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
          Authorization: `Bearer ${localStorage.getItem("K0lgfWr")}`
        }
      };
      let form = new FormData();
      form.append("gambar", this.dataTambah.gambar);
      form.append("link", this.dataTambah.link);
      form.append("selesai", this.dataTambah.selesai);
      form.append("kode_r", this.kode_r);
      form.append("kode_e", this.kode_e);
      this.$axios
        .post(`${process.env.API_URL}/api/v1/flyer`, form, configTambah)
        .then(({ data }) => {
          if (data.sukses) {
            this.$q.notify({
              type: "positive",
              message: `Berhasil Menambah Data`
            });
            this.modalTambah = false;
            this.dataTambah = {};
            this.loadData();
          } else {
            this.$q.notify({
              type: "negative",
              message: data.pesan
            });
          }
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    }
  },
  beforeMount() {
    this.kode_r = localStorage.getItem("kode_r");
    this.kode_e = localStorage.getItem("kode_e");
  },
  mounted() {
    this.loadData();
  }
};
</script>
