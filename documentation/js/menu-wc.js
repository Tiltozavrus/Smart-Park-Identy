'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">smart-parking-identy documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-4fb6a74f82d26c1fc4eacbbe4ac1a92b5afea93799c10a84805bed7719c59d58ac7eaa6f7b6a0f052088c1b04c1c89339bb233ffdd95449c263525dd94ca1add"' : 'data-target="#xs-controllers-links-module-AppModule-4fb6a74f82d26c1fc4eacbbe4ac1a92b5afea93799c10a84805bed7719c59d58ac7eaa6f7b6a0f052088c1b04c1c89339bb233ffdd95449c263525dd94ca1add"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-4fb6a74f82d26c1fc4eacbbe4ac1a92b5afea93799c10a84805bed7719c59d58ac7eaa6f7b6a0f052088c1b04c1c89339bb233ffdd95449c263525dd94ca1add"' :
                                            'id="xs-controllers-links-module-AppModule-4fb6a74f82d26c1fc4eacbbe4ac1a92b5afea93799c10a84805bed7719c59d58ac7eaa6f7b6a0f052088c1b04c1c89339bb233ffdd95449c263525dd94ca1add"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-4fb6a74f82d26c1fc4eacbbe4ac1a92b5afea93799c10a84805bed7719c59d58ac7eaa6f7b6a0f052088c1b04c1c89339bb233ffdd95449c263525dd94ca1add"' : 'data-target="#xs-injectables-links-module-AppModule-4fb6a74f82d26c1fc4eacbbe4ac1a92b5afea93799c10a84805bed7719c59d58ac7eaa6f7b6a0f052088c1b04c1c89339bb233ffdd95449c263525dd94ca1add"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-4fb6a74f82d26c1fc4eacbbe4ac1a92b5afea93799c10a84805bed7719c59d58ac7eaa6f7b6a0f052088c1b04c1c89339bb233ffdd95449c263525dd94ca1add"' :
                                        'id="xs-injectables-links-module-AppModule-4fb6a74f82d26c1fc4eacbbe4ac1a92b5afea93799c10a84805bed7719c59d58ac7eaa6f7b6a0f052088c1b04c1c89339bb233ffdd95449c263525dd94ca1add"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-af9f88b9cc8a0a60aecbbcbcd688bb112848df22b0786f4d17d7caad2c38545ddce72c53e6ca94538f85a82c62e48234b57491d0d5a510bebc174715fdd82d56"' : 'data-target="#xs-controllers-links-module-AuthModule-af9f88b9cc8a0a60aecbbcbcd688bb112848df22b0786f4d17d7caad2c38545ddce72c53e6ca94538f85a82c62e48234b57491d0d5a510bebc174715fdd82d56"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-af9f88b9cc8a0a60aecbbcbcd688bb112848df22b0786f4d17d7caad2c38545ddce72c53e6ca94538f85a82c62e48234b57491d0d5a510bebc174715fdd82d56"' :
                                            'id="xs-controllers-links-module-AuthModule-af9f88b9cc8a0a60aecbbcbcd688bb112848df22b0786f4d17d7caad2c38545ddce72c53e6ca94538f85a82c62e48234b57491d0d5a510bebc174715fdd82d56"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-af9f88b9cc8a0a60aecbbcbcd688bb112848df22b0786f4d17d7caad2c38545ddce72c53e6ca94538f85a82c62e48234b57491d0d5a510bebc174715fdd82d56"' : 'data-target="#xs-injectables-links-module-AuthModule-af9f88b9cc8a0a60aecbbcbcd688bb112848df22b0786f4d17d7caad2c38545ddce72c53e6ca94538f85a82c62e48234b57491d0d5a510bebc174715fdd82d56"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-af9f88b9cc8a0a60aecbbcbcd688bb112848df22b0786f4d17d7caad2c38545ddce72c53e6ca94538f85a82c62e48234b57491d0d5a510bebc174715fdd82d56"' :
                                        'id="xs-injectables-links-module-AuthModule-af9f88b9cc8a0a60aecbbcbcd688bb112848df22b0786f4d17d7caad2c38545ddce72c53e6ca94538f85a82c62e48234b57491d0d5a510bebc174715fdd82d56"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#entities-links"' :
                                'data-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Admin.html" data-type="entity-link" >Admin</a>
                                </li>
                                <li class="link">
                                    <a href="entities/BaseUser.html" data-type="entity-link" >BaseUser</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserSmsCode.html" data-type="entity-link" >UserSmsCode</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AllAuthServiceExceptionsFilter.html" data-type="entity-link" >AllAuthServiceExceptionsFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthControllerEdrrorInterceptor.html" data-type="entity-link" >AuthControllerEdrrorInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="classes/CheckTokenDto.html" data-type="entity-link" >CheckTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAdminDto.html" data-type="entity-link" >CreateAdminDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAdminResp.html" data-type="entity-link" >CreateAdminResp</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTokenResp.html" data-type="entity-link" >CreateTokenResp</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAdminResp.html" data-type="entity-link" >GetAdminResp</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUsersResp.html" data-type="entity-link" >GetUsersResp</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginAdminDto.html" data-type="entity-link" >LoginAdminDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginUserDto.html" data-type="entity-link" >LoginUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokenDto.html" data-type="entity-link" >RefreshTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenFactory.html" data-type="entity-link" >TokenFactory</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAdminDto.html" data-type="entity-link" >UpdateAdminDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserCreateResp.html" data-type="entity-link" >UserCreateResp</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/JwtGuard.html" data-type="entity-link" >JwtGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link" >RolesGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CreatedToken.html" data-type="entity-link" >CreatedToken</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreatedTokens.html" data-type="entity-link" >CreatedTokens</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DecodedToken.html" data-type="entity-link" >DecodedToken</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Payload.html" data-type="entity-link" >Payload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Payload-1.html" data-type="entity-link" >Payload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TokenInfo.html" data-type="entity-link" >TokenInfo</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});