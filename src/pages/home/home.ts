import { Component } from '@angular/core';
import { NavController, LoadingController, ActionSheetController } from 'ionic-angular';

import { MusicProvider } from '../../providers/music/music';
import { MusicPlayerPage } from '../../pages/music-player/music-player';

import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public allMusic = [];

  constructor(public navCtrl: NavController,
    private musicProvider: MusicProvider,
    private loadingController: LoadingController,
    private actionSheetController: ActionSheetController,
    private socialSharing: SocialSharing) {

  }

  ionViewDidLoad() {
    let allMusicLoadingController = this.loadingController.create({
      content: "Getting Your Music :)"
    });

    allMusicLoadingController.present();

    this.musicProvider.getMusic()
    .subscribe((musicList) => {
      allMusicLoadingController.dismiss();
      this.allMusic = musicList
    });
  }

  addSongs(refresher) {
    this.musicProvider.getSongs()
    .subscribe((refreshSongs )=> {
      this.allMusic.unshift(refreshSongs[0]);
      refresher.complete();
    });
  }

  shareSong(music) {
    let shareSongActionSheet = this.actionSheetController.create({
      title: "Share song with Friends",
      buttons: [
      {
        text: "Share On Facebook",
        icon: "logo-facebook",
        handler: () => {
          this.socialSharing.shareViaFacebook(music.name, music.image, music.music_url);
        }

      },
      {
        text: "Share On Twitter",
        icon:"logo-twitter",
        handler: () => {
          this.socialSharing.shareViaTwitter(music.name, music.image, music.music_url);
        }
      },
      {
        text: "Share",
        icon: "share",
        handler: () => {
          this.socialSharing.share(music.name, "", music.image, music.music_url);
        }
      },
      {
        text: "Cancel",
        role: "destructive"
      }
    ]
    });
    shareSongActionSheet.present();
  }

  goToMusicPlayer(music) {
    this.navCtrl.push(MusicPlayerPage, {
      music: music
    });
  }

  addToFavorite(music) {
    this.musicProvider.addFavorite(music);
  }

}
