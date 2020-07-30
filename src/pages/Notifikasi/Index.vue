<template>
    <q-page>
        <!-- modal download laporan -->
    <q-dialog v-model="modalDownload" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Downloaad</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{this.linkDownloadLaporan.substring(0, 50) + ".." }}
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Iya"  @click="downloadLaporan(linkDownloadLaporan)" />
          <q-btn flat label="Tidak" icon="download" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
        <!-- end modal download laporan -->
            <!-- modal tambah-->
    <q-dialog v-model="modalTambah">
      <q-card class="my-card q-ma-sm q-pa-sm">
        <q-card-section>
          <div class="text-h6">Buat notifikasi</div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-xl-12">
              <q-input
                filled
                v-model="formNotifikasi.headings.en"
                class="q-ma-sm"
                label="Judul"
              />
              <q-input
                filled
                v-model="formNotifikasi.contents.en"
                class="q-ma-sm"
                label="Isi"
              />
               <q-input
                filled
                v-model="formNotifikasi.url"
                class="q-ma-sm"
                label="URL"
              />
              <q-select 
              class="q-ma-sm" 
              filled v-model="formNotifikasi.included_segments[0]" 
              :options="options" 
              label="Kirim ke" />
            </div>
          </div>
          <q-btn
            color="primary"
            label="Kirim"
            class="q-ma-sm"
            @click="kirimNotif"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- end modal tambah -->
            <div class="q-ma-sm">
                <q-btn color="primary" @click="modalTambah = true" class="q-ma-sm">
                    Notif Baru
                </q-btn>
                <q-btn color="primary"  @click="report()" class="q-ma-sm">
                    <i class="fa fa-download q-ma-sm"></i> Download
                </q-btn>
            </div>
        <div class="row flex flex-center">
            <q-card 
            class="q-pa-sm q-ma-sm col-xl-4 col-md-3 col-sm-12 my-card bg-primary text-white"
            v-for="(notif,i) in notifikasi.notifications"
            :key="i"
            >
            <q-card-section align="right" class="q-mr-none q-mt-none q-pt-none q-pb-none q-pr-none"><i class="fa fa-times" style="cursor:pointer" @click="hapusNotif(notif.id)"></i></q-card-section>
                Konten : {{notif.contents ? (notif.contents.en ?  notif.contents.en.substring(0, 50) + ".." : notif.contents.id.substring(0, 50) + "..") : ''}}
                <div v-if="notif.url !== null">
                    URL : {{notif.url}}
                </div>
                <q-separator />
                Selesai Pada : {{moment(notif.completed_at).locale('id').format('dddd HH:MM DD/MM/YY')}}<br>
                Sukses : {{notif.successful}} <br>
                Error : {{notif.errored}} <br>
            </q-card>
        </div>
    </q-page>
</template>
<script>
import moment from 'moment'
export default {
    data(){
        return{
            modalDownload: false,
            linkDownloadLaporan:'',
            formNotifikasi: {
                headings: {},
                contents: {},
                included_segments: []
            },
            notifikasi: {},
            modalTambah: false,
            options: [
            'All', 'Active Users'
      ]
        }
    },
    methods: {
        moment,
        downloadLaporan(link){
            window.open(link)
        },
        
       async report(){
        let config = {
            headers: {
            Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`
            }
        };
         this.modalDownload = true
            await this.$axios
            .post(`https://onesignal.com/api/v1/players/csv_export?app_id=${process.env.ONESIGNAL_APP_ID}`,{}, config)
            .then(response => {
                this.linkDownloadLaporan = response.data.csv_file_url
                this.$q.notify({
                color: "negative",
                position: "top",
                message: response.csv_file_url,                
                icon: "report_problem"
            });
            })
            .catch(error => {
            this.$q.notify({
                color: "negative",
                position: "top",
                message: error,                
                icon: "report_problem"
            });
            });

        },
        async hapusNotif(id){
        let config = {
            headers: {
            Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`
            }
        };
            await this.$axios
            .delete(`https://onesignal.com/api/v1/notifications/${id}?app_id=${process.env.ONESIGNAL_APP_ID}`, config)
            .then(response => {
            this.LoadData()
            })
            .catch(error => {
            this.$q.notify({
                color: "negative",
                position: "top",
                message: error.response.data.errors[0],                
                icon: "report_problem"
            });
            });
        },
        async LoadData(){
            let config = {
            headers: {
            Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`
            }
        };
        await this.$axios
            .get(`https://onesignal.com/api/v1/notifications?app_id=${process.env.ONESIGNAL_APP_ID}`, config)
            .then(response => {
            this.notifikasi = response.data;
            })
            .catch(() => {
            this.$q.notify({
                color: "negative",
                position: "top",
                message: "Terjadi kesalahan",
                icon: "report_problem"
            });
            });
        },

        async kirimNotif(){
        let config = {
            headers: {
            Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
            "Content-Type" : "application/json",
            }
        };
        await this.$axios
            .post(`https://onesignal.com/api/v1/notifications`,this.formNotifikasi, config)
            .then(response => {
             this.$q.notify({
                color: "positive",
                position: "top",
                message: "Berhasil Mengirim",
                icon: "fa fa-check"
            });
            this.LoadData()
            this.modalTambah = false
            })
            .catch(() => {
            this.$q.notify({
                color: "negative",
                position: "top",
                message: "Terjadi kesalahan",
                icon: "report_problem"
            });
            });
        }
    },
    created(){
        this.LoadData()
        this.formNotifikasi.app_id = process.env.ONESIGNAL_APP_ID
    }
}
</script>