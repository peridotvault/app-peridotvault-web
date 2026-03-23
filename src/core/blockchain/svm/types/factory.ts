/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/factory.json`.
 */
export type Factory = {
  "address": "3EaXmAr9wAvYgXhz1BH4Kpa5DDCc5oTykeeGtBHeqYXA",
  "metadata": {
    "name": "factory",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createGame",
      "discriminator": [
        124,
        69,
        75,
        66,
        184,
        220,
        72,
        206
      ],
      "accounts": [
        {
          "name": "publisher",
          "writable": true,
          "signer": true
        },
        {
          "name": "factoryState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  99,
                  116,
                  111,
                  114,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "pgcProgram",
          "address": "BDqzDEUTfzskChktZwNsceHj3Vnr7g3322JgPKrMqsip"
        },
        {
          "name": "pgcGameState",
          "writable": true
        },
        {
          "name": "pgcGameAuthority"
        },
        {
          "name": "publisherMinterAuth",
          "writable": true
        },
        {
          "name": "gameStoreMinterAuth",
          "writable": true
        },
        {
          "name": "registryProgram",
          "address": "3bUSqLjWxUgmruzuRwhtWwhV93b4RXVN7bE5qHxHHxLj"
        },
        {
          "name": "registryState",
          "writable": true
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "gameStore",
          "writable": true
        },
        {
          "name": "gameStoreProgram",
          "address": "DSiyompbYR2k2GsS69FWkvE9N3vf32Da4JNqZKYvn2Pp"
        },
        {
          "name": "publisherFeeTokenAccount",
          "writable": true,
          "optional": true
        },
        {
          "name": "treasuryFeeTokenAccount",
          "writable": true,
          "optional": true
        },
        {
          "name": "feePaymentMint",
          "optional": true
        },
        {
          "name": "paymentTokenProgram",
          "optional": true
        },
        {
          "name": "priceCurrencyMint",
          "optional": true
        },
        {
          "name": "licenseTokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "string"
        },
        {
          "name": "metadataUri",
          "type": "string"
        },
        {
          "name": "initialPrice",
          "type": "u64"
        },
        {
          "name": "initialPriceCurrency",
          "type": "pubkey"
        },
        {
          "name": "registrationPaymentMethod",
          "type": "pubkey"
        }
      ],
      "returns": "pubkey"
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "factoryState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  99,
                  116,
                  111,
                  114,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "governance",
          "type": "pubkey"
        },
        {
          "name": "registry",
          "type": "pubkey"
        },
        {
          "name": "gameStore",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setGameStore",
      "discriminator": [
        194,
        135,
        26,
        65,
        196,
        180,
        175,
        192
      ],
      "accounts": [
        {
          "name": "governance",
          "signer": true,
          "relations": [
            "factoryState"
          ]
        },
        {
          "name": "factoryState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  99,
                  116,
                  111,
                  114,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "gameStore",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setGovernance",
      "discriminator": [
        34,
        71,
        128,
        245,
        179,
        42,
        140,
        137
      ],
      "accounts": [
        {
          "name": "governance",
          "signer": true,
          "relations": [
            "factoryState"
          ]
        },
        {
          "name": "factoryState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  99,
                  116,
                  111,
                  114,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "governance",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setRegistry",
      "discriminator": [
        181,
        236,
        34,
        132,
        250,
        2,
        83,
        137
      ],
      "accounts": [
        {
          "name": "governance",
          "signer": true,
          "relations": [
            "factoryState"
          ]
        },
        {
          "name": "factoryState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  102,
                  97,
                  99,
                  116,
                  111,
                  114,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "registry",
          "type": "pubkey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "factoryState",
      "discriminator": [
        91,
        157,
        184,
        99,
        123,
        112,
        102,
        7
      ]
    },
    {
      "name": "registryState",
      "discriminator": [
        29,
        34,
        224,
        195,
        175,
        183,
        99,
        97
      ]
    },
    {
      "name": "storeState",
      "discriminator": [
        216,
        96,
        91,
        102,
        135,
        35,
        32,
        195
      ]
    }
  ],
  "events": [
    {
      "name": "factoryInitialized",
      "discriminator": [
        20,
        86,
        103,
        75,
        20,
        220,
        162,
        63
      ]
    },
    {
      "name": "gameCreated",
      "discriminator": [
        218,
        25,
        150,
        94,
        177,
        112,
        96,
        2
      ]
    },
    {
      "name": "gameStoreUpdated",
      "discriminator": [
        250,
        187,
        196,
        12,
        97,
        123,
        148,
        87
      ]
    },
    {
      "name": "governanceUpdated",
      "discriminator": [
        242,
        176,
        180,
        4,
        237,
        220,
        12,
        2
      ]
    },
    {
      "name": "registryUpdated",
      "discriminator": [
        152,
        3,
        201,
        176,
        91,
        63,
        47,
        83
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "emptyGameId",
      "msg": "Game ID must not be empty"
    },
    {
      "code": 6001,
      "name": "emptyMetadataUri",
      "msg": "Metadata URI must not be empty"
    },
    {
      "code": 6002,
      "name": "gameIdTooLong",
      "msg": "Game ID is too long"
    },
    {
      "code": 6003,
      "name": "metadataUriTooLong",
      "msg": "Metadata URI is too long"
    },
    {
      "code": 6004,
      "name": "invalidGovernance",
      "msg": "Invalid governance address"
    },
    {
      "code": 6005,
      "name": "invalidRegistry",
      "msg": "Invalid registry address"
    },
    {
      "code": 6006,
      "name": "invalidGameStore",
      "msg": "Invalid game store address"
    },
    {
      "code": 6007,
      "name": "invalidMint",
      "msg": "Invalid mint PDA"
    },
    {
      "code": 6008,
      "name": "unauthorized",
      "msg": "unauthorized"
    }
  ],
  "types": [
    {
      "name": "factoryInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "governance",
            "type": "pubkey"
          },
          {
            "name": "registry",
            "type": "pubkey"
          },
          {
            "name": "gameStore",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "factoryState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "registry",
            "type": "pubkey"
          },
          {
            "name": "gameStore",
            "type": "pubkey"
          },
          {
            "name": "governance",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "gameCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "string"
          },
          {
            "name": "metadataUri",
            "type": "string"
          },
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "gameStoreUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "oldGameStore",
            "type": "pubkey"
          },
          {
            "name": "newGameStore",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "governanceUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "oldGovernance",
            "type": "pubkey"
          },
          {
            "name": "newGovernance",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "priceConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "string"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "currency",
            "type": "pubkey"
          },
          {
            "name": "discountBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "publisherBalance",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "token",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "registrationFeeOption",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "paymentMethod",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "registryGame",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "string"
          },
          {
            "name": "contractAddress",
            "type": "pubkey"
          },
          {
            "name": "status",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "registryState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "governance",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "factory",
            "type": "pubkey"
          },
          {
            "name": "registrationFeeOptions",
            "type": {
              "vec": {
                "defined": {
                  "name": "registrationFeeOption"
                }
              }
            }
          },
          {
            "name": "admins",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "feeExemptions",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "games",
            "type": {
              "vec": {
                "defined": {
                  "name": "registryGame"
                }
              }
            }
          },
          {
            "name": "allGameIds",
            "type": {
              "vec": "string"
            }
          }
        ]
      }
    },
    {
      "name": "registryUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "oldRegistry",
            "type": "pubkey"
          },
          {
            "name": "newRegistry",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "storeState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "registry",
            "type": "pubkey"
          },
          {
            "name": "governance",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "platformFeeBps",
            "type": "u16"
          },
          {
            "name": "prices",
            "type": {
              "vec": {
                "defined": {
                  "name": "priceConfig"
                }
              }
            }
          },
          {
            "name": "publisherBalances",
            "type": {
              "vec": {
                "defined": {
                  "name": "publisherBalance"
                }
              }
            }
          }
        ]
      }
    }
  ]
};
