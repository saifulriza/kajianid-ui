<template>
  <q-page>
    <!-- modal edit-->
    <q-dialog v-model="modalEdit">
      <q-card class="my-card q-ma-sm q-pa-sm">
        <q-card-section>
          <div class="text-h6">Edit Data</div>
        </q-card-section>
        <q-card-section>
          <div class="row flex flex-center"></div>
          <div class="row">
            <div class="col-12">
              <q-input
                filled
                v-model="profile.bahasan"
                label="Bahasan"
                class="q-ma-sm"
              />
              <q-input
                filled
                v-model="profile.tanggal"
                class="q-ma-sm"
                mask="date"
                label="Tanggal"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="profile.tanggal"
                        @input="() => $refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input
                filled
                v-model="profile.jam_mulai"
                mask="time"
                :rules="['time']"
                label="Jam mulai"
                class="q-ma-sm"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time v-model="profile.jam_mulai" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input
                filled
                v-model="profile.jam_selesai"
                mask="time"
                :rules="['time']"
                label="Jam selesai"
                class="q-ma-sm"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time v-model="profile.jam_selesai" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-select
                filled
                v-model="profile.hari"
                :options="options"
                label="Hari"
                class="q-ma-sm"
              />
              <q-input
                filled
                v-model="profile.youtube"
                label="Link Youtube"
                class="q-ma-sm"
              />
              <div v-if="typeof profile.guru !== 'undefined'">
                <q-input
                  filled
                  v-model="profile.guru.nama"
                  label="Ustadz"
                  class="q-ma-sm"
                  :disable="true"
                />
              </div>
              <div class="q-ma-sm">
                <autocomplete
                  source="https://kajian.riza.my.id/api/v1/guru/allnama/"
                  placeholder="Ustadz"
                  input-class="q-ma-sm"
                  results-value="id"
                  results-property="id"
                  results-display="nama"
                  @selected="setProfileGuru"
                >
                </autocomplete>
              </div>
              <div v-if="typeof profile.guru !== 'undefined'">
                <q-input
                  filled
                  v-model="profile.masjid.nama"
                  label="Ustadz"
                  class="q-ma-sm"
                  :disable="true"
                />
              </div>
              <div class="q-ma-sm">
                <autocomplete
                  source="https://kajian.riza.my.id/api/v1/masjid/allnama/"
                  placeholder="Masjid/Mushalla/Meunasah"
                  input-class="q-ma-sm"
                  results-value="id"
                  results-property="id"
                  results-display="nama"
                  @selected="setProfileMasjid"
                >
                </autocomplete>
              </div>
              <div v-if="typeof profile.tag !== 'undefined'">
                <q-card class="q-ma-sm q-pa-sm" v-if="profile.tag.length > 0">
                  <div class="flex flex-center">
                    <div class="text-subtitle2">Tag</div>
                  </div>
                  <q-badge
                    color="blue"
                    v-for="tag in profile.tag"
                    :key="tag.id"
                    class="q-ma-sm"
                  >
                    {{ tag.tag }}
                    <q-badge
                      color="red"
                      class="q-ml-sm"
                      style="cursor:pointer"
                      @click="hapusTag(tag.id, profile.id)"
                      >x</q-badge
                    >
                  </q-badge>
                  <div class="flex flex-center">
                    <div class="text-subtitle2">
                      <q-input
                        filled
                        v-model="dataTambahTag.tag"
                        label="Tag"
                        size="xs"
                        class="q-ma-sm"
                      />
                      <q-btn
                        color="primary"
                        label="Tambah"
                        @click="tambahTag(profile.id)"
                        size="xs"
                      />
                    </div>
                  </div>
                </q-card>
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
          <div class="row flex flex-center"></div>
          <div class="row">
            <div class="col-12">
              <q-input
                filled
                v-model="dataTambah.bahasan"
                label="Bahasan"
                class="q-ma-sm"
              />
              <q-input
                filled
                v-model="dataTambah.tanggal"
                class="q-ma-sm"
                mask="date"
                label="Tanggal"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="dataTambah.tanggal"
                        @input="() => $refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input
                filled
                v-model="dataTambah.jam_mulai"
                mask="time"
                :rules="['time']"
                label="Jam mulai"
                class="q-ma-sm"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time v-model="dataTambah.jam_mulai" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input
                filled
                v-model="dataTambah.jam_selesai"
                mask="time"
                :rules="['time']"
                label="Jam selesai"
                class="q-ma-sm"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time v-model="dataTambah.jam_selesai" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-select
                filled
                v-model="dataTambah.hari"
                :options="options"
                label="Hari"
                class="q-ma-sm"
              />
              <q-input
                filled
                v-model="dataTambah.youtube"
                label="Link Youtube"
                class="q-ma-sm"
              />
              <div class="q-ma-sm">
                <autocomplete
                  source="https://kajian.riza.my.id/api/v1/guru/allnama/"
                  placeholder="Ustadz"
                  input-class="q-ma-sm"
                  results-value="id"
                  results-property="id"
                  results-display="nama"
                  @selected="setGuru"
                >
                </autocomplete>
              </div>
              <div class="q-ma-sm">
                <autocomplete
                  source="https://kajian.riza.my.id/api/v1/masjid/allnama/"
                  placeholder="Masjid/Mushalla/Meunasah"
                  input-class="q-ma-sm"
                  results-value="id"
                  results-property="id"
                  results-display="nama"
                  @selected="setMasjid"
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
      @click="modalTambah = true"
      label="Tambah"
      class="q-ma-sm"
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
          @keyup.enter="cariKajian(cari)"
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
      tag: {},
      dataTambahTag: {},
      dataTambah: {},
      modalEdit: false,
      modalTambah: false,
      profile: {},
      cari: "",
      filter: "",
      loading: false,
      serverPagination: {
        page: 1,
        rowsNumber: 10
      },

      serverData: [],
      columns: [
        {
          name: "bahasan",
          required: true,
          label: "Bahasan",
          align: "left",
          field: "bahasan",
          sortable: true
        },
        {
          name: "jam",
          label: "Jam",
          field: row => row.jam_mulai + " - " + row.jam_selesai,
          sortable: true
        },
        {
          name: "hari",
          label: "Hari ",
          field: "hari",
          sortable: true
        },
        {
          name: "ustadz",
          label: "Ustadz ",
          field: row => row.guru.nama,
          sortable: true
        },
        {
          name: "masjid",
          label: "Masjid ",
          field: row => row.masjid.nama,
          sortable: true
        }
      ],
      options: ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu", "Minggu"]
    };
  },
  methods: {
    cariKajian(text) {
      this.$axios
        .get(`${process.env.API_URL}/api/v1/kajian/nama/${text}`)
        .then(({ data }) => {
          // updating pagination to reflect in the UI

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
          console.log(error);
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
          `${process.env.API_URL}/api/v1/kajian/${id}?_method=DELETE`,
          form,
          configDelete
        )
        .then(({ data }) => {
          // updating pagination to reflect in the UI

          // we also set (or update) rowsNumber
          this.$q.notify({
            type: "positive",
            message: "Berhasil menghapus"
          });
          this.serverPagination.rowsNumber = data.per_page;

          // then we update the rows with the fetched ones
          this.serverData = data.data;
          this.modalEdit = false;
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
    hapusTag(idtag, idprofile) {
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
          `${process.env.API_URL}/api/v1/tag/${idtag}?_method=DELETE`,
          form,
          configDelete
        )
        .then(({ data }) => {
          if (data.sukses) {
            this.$q.notify({
              type: "positive",
              message: "Sukses menghapus"
            });
            this.refreshProfile(idprofile);
          }
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
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
      let formEdit = new FormData();
      formEdit.append("tanggal", this.profile.tanggal);
      formEdit.append("bahasan", this.profile.bahasan);
      formEdit.append("jam_mulai", this.profile.jam_mulai);
      formEdit.append("jam_selesai", this.profile.jam_selesai);
      formEdit.append("hari", this.profile.hari);
      formEdit.append("youtube", this.profile.youtube);
      formEdit.append("guru_id", this.profile.guru ? this.profile.guru.id : "");
      formEdit.append(
        "masjid_id",
        this.profile.masjid ? this.profile.masjid.id : ""
      );
      formEdit.append("kode_r", this.kode_r);
      formEdit.append("kode_e", this.kode_e);
      this.$axios
        .post(
          `${process.env.API_URL}/api/v1/kajian/${id}?_method=PUT`,
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
    onRowClick(evt, row) {
      this.modalEdit = true;
      this.$axios
        .get(`${process.env.API_URL}/api/v1/kajian/${row.id}`)
        .then(({ data }) => {
          // updating pagination to reflect in the UI
          console.log(data);
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
    tambahTag(id) {
      let configTambah = {
        headers: {
          //'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
          Authorization: `Bearer ${localStorage.getItem("K0lgfWr")}`
        }
      };
      let form = new FormData();
      form.append("tag", this.dataTambahTag.tag);
      form.append("kajian_id", id);
      form.append("kode_r", this.kode_r);
      form.append("kode_e", this.kode_e);
      this.$axios
        .post(`${process.env.API_URL}/api/v1/tag`, form, configTambah)
        .then(({ data }) => {
          if (data.sukses) {
            this.$q.notify({
              type: "positive",
              message: `Berhasil Menambah Data`
            });

            this.refreshProfile(id);
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
    tambah() {
      let configTambah = {
        headers: {
          //'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
          Authorization: `Bearer ${localStorage.getItem("K0lgfWr")}`
        }
      };
      let form = new FormData();
      form.append("tanggal", this.dataTambah.tanggal);
      form.append("bahasan", this.dataTambah.bahasan);
      form.append("jam_mulai", this.dataTambah.jam_mulai);
      form.append("jam_selesai", this.dataTambah.jam_selesai);
      form.append("hari", this.dataTambah.hari);
      form.append("youtube", this.dataTambah.youtube);
      form.append("guru_id", this.dataTambah.guru_id);
      form.append("masjid_id", this.dataTambah.masjid_id);
      form.append("role", "AdminGuru");
      form.append("kode_r", this.kode_r);
      form.append("kode_e", this.kode_e);
      this.$axios
        .post(`${process.env.API_URL}/api/v1/kajian`, form, configTambah)
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
    },
    setTag(event) {
      this.tag = event.display;
    },
    setProfileGuru(event) {
      this.profile.guru.id = event.value;
      this.profile.guru.nama = event.display;
    },
    setProfileMasjid(event) {
      this.profile.masjid.id = event.value;
      this.profile.masjid.nama = event.display;
    },
    setGuru(event) {
      this.dataTambah.guru_id = event.value;
    },
    setMasjid(event) {
      this.dataTambah.masjid_id = event.value;
    },
    request({ pagination, filter }) {
      // we set QTable to "loading" state
      this.loading = true;

      // we do the server data fetch, based on pagination and filter received
      // (using Axios here, but can be anything; parameters vary based on backend implementation)

      this.$axios
        .get(`${process.env.API_URL}/api/v1/kajian?page=${pagination.page}`)
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
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
          this.loading = false;
        });
    },
    onRowClick(evt, row) {
      this.modalEdit = true;
      this.refreshProfile(row.id);
    },
    async refreshProfile(id) {
      await this.$axios
        .get(`${process.env.API_URL}/api/v1/kajian/${id}`)
        .then(({ data }) => {
          // updating pagination to reflect in the UI
          this.profile = data;
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
    }
  },

  mounted() {
    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    });
    this.kode_r = localStorage.getItem("kode_r");
    this.kode_e = localStorage.getItem("kode_e");
  }
};
</script>
