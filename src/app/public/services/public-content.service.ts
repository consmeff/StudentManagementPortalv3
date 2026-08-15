import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  CONTACT_DETAILS,
  DIRECTORS_SPEECH,
  FACILITIES,
  HERO_CONTENT,
  MANAGEMENT_TEAM,
  NEWS_ARTICLES,
  OBJECTIVES,
  PROGRAMMES,
  PROGRAMMES_IMAGE,
  QUICK_LINKS,
  SITE_IDENTITY,
  SOCIAL_LINKS
} from '../data/public-content.data';
import {
  ContactDetails,
  DirectorsSpeech,
  Facility,
  FooterLink,
  HeroContent,
  NewsArticle,
  Objective,
  Programme,
  SiteIdentity,
  SocialLink,
  TeamMember
} from '../models/public-content.models';

/**
 * Single source of content for the public site.
 *
 * Backed by in-repo constants today and deliberately Observable-returning so the
 * swap to HTTP is confined to this class — components already handle content
 * arriving asynchronously.
 */
@Injectable({ providedIn: 'root' })
export class PublicContentService {
  getSiteIdentity(): Observable<SiteIdentity> {
    return of(SITE_IDENTITY);
  }

  getHero(): Observable<HeroContent> {
    return of(HERO_CONTENT);
  }

  getObjectives(): Observable<Objective[]> {
    return of(OBJECTIVES);
  }

  getDirectorsSpeech(): Observable<DirectorsSpeech> {
    return of(DIRECTORS_SPEECH);
  }

  getManagementTeam(): Observable<TeamMember[]> {
    return of(MANAGEMENT_TEAM);
  }

  getProgrammes(): Observable<Programme[]> {
    return of(PROGRAMMES);
  }

  getProgrammesImage(): Observable<string | null> {
    return of(PROGRAMMES_IMAGE);
  }

  getFacilities(): Observable<Facility[]> {
    return of(FACILITIES);
  }

  /**
   * @param limit Maximum number of articles to return; omit for the full list.
   */
  getNews(limit?: number): Observable<NewsArticle[]> {
    return of(typeof limit === 'number' ? NEWS_ARTICLES.slice(0, limit) : NEWS_ARTICLES);
  }

  getQuickLinks(): Observable<FooterLink[]> {
    return of(QUICK_LINKS);
  }

  getFooterProgrammeLinks(): Observable<FooterLink[]> {
    return of(
      PROGRAMMES.map((programme) => ({
        label: programme.name,
        route: programme.route ?? '/programmes',
        href: null
      }))
    );
  }

  getContactDetails(): Observable<ContactDetails> {
    return of(CONTACT_DETAILS);
  }

  getSocialLinks(): Observable<SocialLink[]> {
    return of(SOCIAL_LINKS);
  }
}
