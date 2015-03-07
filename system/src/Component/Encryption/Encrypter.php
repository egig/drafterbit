<?php namespace Drafterbit\Component\Encryption;

class Encrypter {

    /**
     * The encryption key.
     *
     * @var string
     */
    protected $key;

    /**
     * The algorithm used for encryption.
     *
     * @var string
     */
    protected $cipher = 'rijndael-256';

    /**
     * The mode used for encryption.
     *
     * @var string
     */
    protected $mode = 'cbc';

    /**
     * The block size of the cipher.
     *
     * @var int
     */
    protected $block = 32;

    /**
     * Create a new encrypter instance.
     *
     * @param  string  $key
     * @return void
     */
    public function __construct($key)
    {
        if ( ! extension_loaded('mcrypt')) {
            throw new Exceptions\McryptNotLoadedException('Mcrypt PHP extension is required.');
        }

        $this->key = $key;
    }

    /**
     * Encrypt the given value.
     *
     * @param  string  $value
     * @return string
     */
    public function encrypt($value)
    {
        $iv = mcrypt_create_iv(
                mcrypt_get_iv_size($this->cipher, $this->mode),
                $this->getRandomizer());

        $value = base64_encode(
            mcrypt_encrypt(
                $this->cipher,
                $this->key,
                $this->addPadding(serialize($value)),
                $this->mode,
                $iv
            )
        );

        $mac = $this->hashHMac($iv = base64_encode($iv), $value);
        return base64_encode(json_encode(compact('iv', 'value', 'mac')));
    }

    /**
     * Decrypt the given value.
     *
     * @param  string  $payload
     * @return string
     */
    public function decrypt($payload)
    {
        $payload = json_decode(base64_decode($payload), true);

        $this->validatePayload( $payload );

        $decrypted = mcrypt_decrypt(
            $this->cipher,
            $this->key,
            base64_decode($payload['value']),
            $this->mode,
            base64_decode($payload['iv'])
        );

        return unserialize($this->removePadding( $decrypted ));
    }

    /**
     * Validate payload.
     *
     * @param  string  $payload
     * @return void
     *
     * @throws DecryptException 
     */
    protected function validatePayload($payload)
    {
        if ( ! $payload || ! $this->validData($payload)) {
            throw new Exceptions\DecryptException("Invalid data.");
        }   

        if ( ! $this->validMac($payload)) {
            throw new Exceptions\DecryptException("MAC is invalid.");
        }
    }

    /**
     * Determine if the MAC for the given payload is valid.
     *
     * @param  array  $payload
     * @return bool
     */
    protected function validMac(array $payload)
    {
        return ($payload['mac'] === $this->hashHMac($payload['iv'], $payload['value']));
    }

    /**
     * Create a MAC for the given value.
     *
     * @param  string  $iv
     * @param  string  $value
     * @return string
     */
    protected function hashHMac($iv, $value)
    {
        return hash_hmac('sha256', $iv.$value, $this->key);
    }

    /**
     * Add PKCS7 padding to a given value.
     *
     * @param  string  $value
     * @return string
     */
    protected function addPadding($value)
    {
        $pad = $this->block - (strlen($value) % $this->block);

        return $value.str_repeat(chr($pad), $pad);
    }

    /**
     * Remove the padding from the given value.
     *
     * @param  string  $value
     * @return string
     */
    protected function removePadding($value)
    {
        $pad = ord($value[($len = strlen($value)) - 1]);

        return $this->paddingIsValid($pad, $value) ? substr($value, 0, strlen($value) - $pad) : $value;
    }

    /**
     * Determine if the given padding for a value is valid.
     *
     * @param  string  $pad
     * @param  string  $value
     * @return bool
     */
    protected function paddingIsValid($pad, $value)
    {
        return substr($value, strlen($value) - $pad) == str_repeat(substr($value, -1), $pad);
    }

    /**
     * Verify that the encryption payload is valid.
     *
     * @param  array|mixed  $data
     * @return bool
     */
    protected function validData($data)
    {
        return is_array($data) || isset($data['iv']) || isset($data['value']) || isset($data['mac']);
    }

    /**
     * Get the random data source available for the OS.
     *
     * @return int
     */
    protected function getRandomizer()
    {
        if (defined('MCRYPT_DEV_URANDOM')) return MCRYPT_DEV_URANDOM;

        if (defined('MCRYPT_DEV_RANDOM')) return MCRYPT_DEV_RANDOM;

        mt_srand();

        return MCRYPT_RAND;
    }

    /**
     * Set the encryption key.
     *
     * @param  string  $key
     * @return void
     */
    public function setKey($key)
    {
        $this->key = $key;
    }

    /**
     * Set the encryption cipher.
     *
     * @param  string  $cipher
     * @return void
     */
    public function setCipher($cipher)
    {
        $this->cipher = $cipher;
    }

    /**
     * Set the encryption mode.
     *
     * @param  string  $mode
     * @return void
     */
    public function setMode($mode)
    {
        $this->mode = $mode;
    }
}