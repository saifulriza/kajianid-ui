<template>
  <q-page>
    <!-- modal edit-->
    <q-dialog v-model="modalEdit">
      <q-card class="my-card q-ma-sm q-pa-sm">
        <q-card-section>
          <div class="text-h6">Edit Data</div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-xl-12">
              <q-input
                filled
                v-model="profile.nama"
                class="q-ma-sm"
                label="Nama"
              />
              <q-select
                class="q-ma-sm"
                filled
                v-model="profile.jenis"
                :options="['Mushalla', 'Meunasah', 'Masjid']"
                stack-label
                label="Jenis"
                :display-value="`${profile.jenis ? profile.jenis : ''}`"
              >
                <template v-slot:append>
                  <q-icon
                    v-if="profile.jenis !== null"
                    class="cursor-pointer"
                    name="clear"
                    @click.stop="profile.jenis = null"
                  />
                </template>
              </q-select>
              <q-input
                filled
                v-model="profile.profil"
                class="q-ma-sm"
                label="Profil"
              />
              <div v-if="profile.alamat !== undefined">
                <q-input
                  filled
                  v-if="profile.alamat !== null"
                  :disable="true"
                  v-model="profile.alamat.nama"
                  disabled
                  class="q-ma-sm"
                  label="Alamat"
                />
              </div>
              <autocomplete
                source="https://kajian.riza.my.id/api/v1/desa/nama/"
                placeholder="Ubah Alamat"
                input-class="q-ma-sm"
                results-value="kode"
                results-property="kode"
                results-display="nama"
                @selected="setAlamat"
              >
              </autocomplete>
              <q-file
                filled
                v-model="profileFoto"
                class="q-ma-sm"
                label="Ganti foto"
              >
                <template v-slot:append>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
              <q-btn
                color="primary"
                label="Tambah Foto"
                class="q-ma-sm"
                @click="tambahFoto(profile.id)"
              />
              <div v-if="typeof profile.foto !== 'undefined'">
                <q-card-section v-if="profile.foto.length > 0">
                  <q-layout
                    view="lHh Lpr lFf"
                    container
                    style="height: 150px; width:250px"
                    class="shadow-2 rounded-borders"
                  >
                    <div v-for="foto in profile.foto" :key="foto.id">
                      <q-img :src="foto.link" class="q-mt-sm q-mb-sm">
                        <div
                          class="absolute-top text-center"
                          style="cursor:pointer"
                          @click="hapusFoto(foto.id)"
                        >
                          Hapus
                        </div>
                      </q-img>
                    </div>
                  </q-layout>
                </q-card-section>
              </div>
            </div>
          </div>
          <q-btn
            color="primary"
            label="Simpan"
            class="q-ma-sm"
            @click="ubah(profile.id)"
          />
          <q-btn
            color="red"
            label="Hapus"
            class="q-ma-sm"
            @click="hapus(profile.id)"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- end modal edit -->

    <!-- modal tambah-->
    <q-dialog v-model="modalTambah">
      <q-card class="my-card q-ma-sm q-pa-sm">
        <q-card-section>
          <div class="text-h6">Tambah Data</div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-xl-12">
              <q-input
                filled
                v-model="dataTambah.nama"
                class="q-ma-sm"
                label="Nama"
              />
              <q-select
                filled
                v-model="dataTambah.jenis"
                class="q-ma-sm"
                :options="['Mushalla', 'Meunasah', 'Masjid']"
                label="Jenis"
              />
              <q-input
                filled
                v-model="dataTambah.profil"
                class="q-ma-sm"
                label="Profil"
              />
              <div class="q-ma-sm">
                <div></div>
                <autocomplete
                  :source="provinsi"
                  placeholder="Provinsi"
                  input-class="q-ma-sm"
                  results-value="kode"
                  results-property="kode"
                  results-display="nama"
                  @selected="setProvinsi"
                >
                </autocomplete>
              </div>

              <div class="q-ma-sm">
                <autocomplete
                  input-class="q-ma-sm"
                  placeholder="Kabupaten"
                  :source="kabupaten"
                  results-value="kode"
                  results-property="kode"
                  results-display="nama"
                  @selected="setKabupaten"
                >
                </autocomplete>
              </div>

              <div class="q-ma-sm">
                <autocomplete
                  input-class="q-ma-sm"
                  placeholder="Kecamatan"
                  :source="kecamatan"
                  results-value="kode"
                  results-property="kode"
                  results-display="nama"
                  @selected="setKecamatan"
                >
                </autocomplete>
              </div>
              <div class="q-ma-sm">
                <autocomplete
                  input-class="q-ma-sm"
                  placeholder="Desa/Kelurahan"
                  :source="desa"
                  results-value="kode"
                  results-property="kode"
                  results-display="nama"
                  @selected="setDesa"
                >
                </autocomplete>
              </div>
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

    <q-btn
      color="primary"
      class="q-ma-sm"
      @click="modalTambah = true"
      label="Tambah"
    />

    <q-table
      class="q-ma-sm"
      ref="table"
      :data="serverData"
      :columns="columns"
      :filter="filter"
      row-key="name"
      :pagination.sync="serverPagination"
      :loading="loading"
      @request="request"
      @row-click="onRowClick"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="100"
          @keyup.enter="cariMasjid(cari)"
          v-model="cari"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import Autocomplete from "vuejs-auto-complete";
export default {
  components: {
    Autocomplete
  },
  data() {
    return {
      profileFoto: [{}],
      desa: {},
      kecamatan: {},
      provinsi: {},
      kabupaten: {},
      options: {},
      cari: "",
      modalTambah: false,
      dataTambah: {},
      modalEdit: false,
      kode_r: "",
      kode_e: "",
      filter: "",
      // profile: {},
      profile: {},
      loading: false,
      serverPagination: {
        page: 1,
        rowsNumber: 10
      },
      serverData: [],
      columns: [
        {
          name: "nama",
          required: true,
          label: "Nama",
          align: "left",
          field: "nama"
        },
        { name: "jenis", label: "Jenis", field: "jenis" },
        {
          name: "profile",
          label: "Profile",
          field: row => row.profil.substring(0, 50) + ".."
        },
        {
          name: "alamat",
          label: "Alamat",
          field: row => (row.alamat !== null ? row.alamat.nama : "Belum ada")
        }
      ]
    };
  },
  methods: {
    tambahFoto(id) {
      let configEdit = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("K0lgfWr")}`,
          "Content-type": "multipart/form-data"
        }
      };
      let formEdit = new FormData();
      formEdit.append("link", this.profileFoto);
      formEdit.append("masjid_id", id);
      formEdit.append("kode_r", this.kode_r);
      formEdit.append("kode_e", this.kode_e);
      this.$axios
        .post(`${process.env.API_URL}/api/v1/foto`, formEdit, configEdit)
        .then(({ data }) => {
          if (data.sukses) {
            this.$q.notify({
              type: "positive",
              message: `Berhasil Mengubah Data`
            });
            this.modalEdit = false;
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
    },
    hapusFoto(id) {
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
          `${process.env.API_URL}/api/v1/foto/${id}?_method=DELETE`,
          form,
          configDelete
        )
        .then(({ data }) => {
          this.$q.notify({
            type: "positive",
            message: data.pesan ? data.pesan : "Berhasil Menghapus Foto"
          });

          this.modalEdit = false;
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
          // there's an error... do SOMETHING

          // we tell QTable to exit the "loading" state
          this.loading = false;
        });
    },
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
          `${process.env.API_URL}/api/v1/masjid/${id}?_method=DELETE`,
          form,
          configDelete
        )
        .then(({ data }) => {
          // updating pagination to reflect in the UI

          // we also set (or update) rowsNumber
          this.serverPagination.rowsNumber = data.per_page;

          // then we update the rows with the fetched ones
          this.serverData = data.data;
          this.modalEdit = false;
          this.$q.notify({
            type: "positive",
            message: data.pesan
          });
          this.request({
            pagination: this.serverPagination,
            filter: this.filter
          });

          // finally we tell QTable to exit the "loading" state
          this.loading = false;
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
          // there's an error... do SOMETHING

          // we tell QTable to exit the "loading" state
          this.loading = false;
        });
    },
    ubah(id) {
      let configEdit = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("K0lgfWr")}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      };
      let alamat = this.profile.alamat !== null ? this.profile.alamat.kode : "";
      let formEdit = new FormData();
      formEdit.append("nama", this.profile.nama);
      formEdit.append("jenis", this.profile.jenis);
      formEdit.append("profil", this.profile.profil);
      formEdit.append("alamat", alamat);
      formEdit.append("kode_r", this.kode_r);
      formEdit.append("kode_e", this.kode_e);
      this.$axios
        .post(
          `${process.env.API_URL}/api/v1/masjid/${id}?_method=PUT`,
          formEdit,
          configEdit
        )
        .then(({ data }) => {
          if (data.sukses) {
            this.$q.notify({
              type: "positive",
              message: `Berhasil Mengubah Data`
            });
            this.modalEdit = false;
            this.profile = {};
            this.request({
              pagination: this.serverPagination,
              filter: this.filter
            });
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
    },
    setProvinsi(event) {
      this.loadKab(event.value);
    },
    setKabupaten(event) {
      this.loadKec(event.value);
    },
    setKecamatan(event) {
      this.loadDesa(event.value);
    },
    setDesa(event) {
      this.dataTambah.alamat = event.value;
    },
    setAlamat(event) {
      this.profile.alamat = { kode: "" };
      this.profile.alamat.nama = event.display;
      this.profile.alamat.kode = event.value;
    },
    async loadWilayah() {
      await this.$axios
        .get(`${process.env.API_URL}/api/v1/wilayah`)
        .then(({ data }) => {
          this.provinsi = data.data;
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            // message: error.response.data.pesan
            message: "Terjadi Kesalahan!"
          });
          this.loading = false;
        });
    },

    async loadKab(kode) {
      await this.$axios
        .get(`${process.env.API_URL}/api/v1/prov/${kode}`)
        .then(({ data }) => {
          this.kabupaten = data;
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            // message: error.response.data.pesan
            message: "Terjadi Kesalahan"
          });
          this.loading = false;
        });
    },

    async loadKec(kode) {
      await this.$axios
        .get(`${process.env.API_URL}/api/v1/kab/${kode}`)
        .then(({ data }) => {
          this.kecamatan = data;
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            // message: error.response.data.pesan
            message: "Terjadi Kesalahan"
          });
          this.loading = false;
        });
    },

    async loadDesa(kode) {
      await this.$axios
        .get(`${process.env.API_URL}/api/v1/kec/${kode}`)
        .then(({ data }) => {
          this.desa = data;
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            // message: error.response.data.pesan
            message: "Terjadi Kesalahan"
          });
          this.loading = false;
        });
    },
    request({ pagination, filter }) {
      // we set QTable to "loading" state
      this.loading = true;

      // we do the server data fetch, based on pagination and filter received
      // (using Axios here, but can be anything; parameters vary based on backend implementation)

      this.$axios
        .get(`${process.env.API_URL}/api/v1/masjid?page=${pagination.page}`)
        .then(({ data }) => {
          // updating pagination to reflect in the UI
          this.serverPagination = pagination;

          // we also set (or update) rowsNumber
          this.serverPagination.rowsNumber = data.per_page;

          // then we update the rows with the fetched ones
          this.serverData = data.data;

          // finally we tell QTable to exit the "loading" state
          this.loading = false;
        })
        .catch(error => {
          // there's an error... do SOMETHING
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
          // we tell QTable to exit the "loading" state
          this.loading = false;
        });
    },
    onRowClick(evt, row) {
      this.modalEdit = true;
      this.$axios
        .get(`${process.env.API_URL}/api/v1/masjid/${row.id}`)
        .then(({ data }) => {
          // updating pagination to reflect in the UI
          this.profile = data[0];
          this.loading = false;
        })
        .catch(error => {
          // there's an error... do SOMETHING
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
          // we tell QTable to exit the "loading" state
          this.loading = false;
        });
    },

    tambah() {
      let configTambah = {
        headers: {
          //'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
          Authorization: `Bearer ${localStorage.getItem("K0lgfWr")}`,
          "Content-Type": "application/json"
        }
      };
      let form = new FormData();
      form.append("nama", this.dataTambah.nama);
      form.append("jenis", this.dataTambah.jenis);
      form.append("profil", this.dataTambah.profil);
      form.append("alamat", this.dataTambah.alamat);
      form.append("kode_r", this.kode_r);
      form.append("kode_e", this.kode_e);
      this.$axios
        .post(`${process.env.API_URL}/api/v1/masjid`, form, configTambah)
        .then(({ data }) => {
          if (data.sukses) {
            this.$q.notify({
              type: "positive",
              message: `Berhasil Menambah Data`
            });
            this.modalTambah = false;
            this.dataTambah = {};
            this.request({
              pagination: this.serverPagination,
              filter: this.filter
            });
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
    // once mounted, we need to trigger the initial server data fetch
    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    }),
      this.loadWilayah();
  }
};
</script>
